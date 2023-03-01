import os
import docker
import tarfile
import subprocess as sp
from config.database import Database

def copy_to(src, dst):
    name, dst = dst.split(':')
    container = client.containers.get(name)

    os.chdir(os.path.dirname(src))
    srcname = os.path.basename(src)
    tar = tarfile.open(src + '.tar', mode='w')
    try:
        tar.add(srcname)
    finally:
        tar.close()

    data = open(src + '.tar', 'rb').read()
    container.put_archive(os.path.dirname(dst), data)

def pass_file_to_docker(src, dst):
    copy_to(os.getcwd().replace("\\tests\\sql_scripts","") + src, '' + str(container_id) + dst)
    os.remove(os.getcwd() + "/" + src.split("/")[-1] + ".tar")

def run_file_in_docker(filename):
    os.system("docker exec -it " + str(container_id) + " psql -U postgres -d statsdb -f " + filename.split("/",1)[-1])

def remove_files_from_docker(filenames):
    for filename in filenames:
        os.system("docker exec -it " + str(container_id) + " rm -rf " + filename.split("/",1)[-1])

db = Database(test = True)
client = docker.from_env()
container_id = sp.getoutput("docker ps -aqf name=statsdb")

# Files to pass (..._src) to Docker destination (..._dst)
init_src, init_dst = "/tests/sql_scripts/test_init.sql", ":/tmp/test_init.sql"
trmn_src, trmn_dst = "/tests/sql_scripts/test_trmn.sql", ":/tmp/test_trmn.sql"

# Pass initialization SQL file to Docker and run it (inputs mock data)
pass_file_to_docker(init_src, init_dst)
run_file_in_docker(init_dst)

# changing current directory so command "pytest" will work as expected, run command "pytest"
os.chdir(os.getcwd()[0:-18])
os.system("pytest")

# Pass termination SQL file to Docker and run it (removes mock data)
pass_file_to_docker(trmn_src, trmn_dst)
run_file_in_docker(trmn_dst)

# Remove initialization and termination SQL files from Docker container
remove_files_from_docker([init_dst, trmn_dst])