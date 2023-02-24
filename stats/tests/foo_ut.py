from services.service import StatsClass
from unittest.mock import patch
from unittest.mock import Mock
from unittest.mock import MagicMock
from config.database import Database
from schemas.schema import CountSchema

import os
import tarfile
import docker

import subprocess as sp

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
    print(src)
    copy_to(os.getcwd().replace("\\tests","") + src, '' + str(container_id) + dst)
    os.remove(os.getcwd() + "/" + src.split("/")[-1] + ".tar")

def run_file_in_docker(filename):
    os.system("docker exec -it " + str(container_id) + " psql -U postgres -d statsdb -f " + filename.split("/",1)[-1])

def remove_file_from_docker(filenames):
    for filename in filenames:
        pass

client = docker.from_env()
container_id = sp.getoutput("docker ps -aqf name=statsdb")

### Testing database.py ###

def test_database_get_replay_count_all():
    db = Database(test = True)
    returned_value = db.get_replay_count_all()
    expected_value = 56
    assert returned_value == expected_value

#
init_src, init_dst = "/tests/test_init.sql", ":/tmp/test_init.sql"
trmn_src, trmn_dst = "/tests/test_trmn.sql", ":/tmp/test_trmn.sql"

pass_file_to_docker(init_src, init_dst)
run_file_in_docker(init_dst)

test_database_get_replay_count_all()

pass_file_to_docker(trmn_src, trmn_dst)
run_file_in_docker(trmn_dst)




# os.system("docker exec -it " + str(container_id) + " psql -U postgres -d statsdb -f /tmp/test_init.sql")


















# os.system("docker exec -it 56a77c929ebd -p ${STATS_DB_PASSWORD} /tmp/test_init.sql")

# output = sp.getoutput('whoami --version')
# print (output)

# container_id = os.system("docker ps -aqf name=statsdb") # docker ps -aqf "name=statsdb"

# client = docker.from_env()
# container = client.containers.get("56a77c929ebd")
# data = open(os.getcwd() + "\\tests\\test_init.sql", "rb").read()
# container.put_archive(os.path.dirname("/tmp/test_init.sql"), data)

# db1 = Database()
# os.system("docker exec -it 56a77c929ebd /bin/bash")
# os.system("psql -U postgres")
# os.system("docker exec 56a77c929ebd 'psql -u postgres -p ${STATS_DB_PASSWORD} < /tests/test_init.sql'")
# os.system("docker exe 56a77c929ebd 'psql -U postgres'")

# os.system("echo 'hello world'")
# test_database_get_replay_count_all()

### Testing service.py methods ###

# def test_get_replay_count_all():
#     # db = Database(test = True)

#     class1 = Mock(spec = Database)

#     # class1.__call__ = MagicMock()
#     # class1.get_replay_count_all = MagicMock(return_value = 14)

#     class1.get_replay_count_all = MagicMock(return_value = 14)

#     returned_schema = StatsClass(db = class1).get_replay_count_all()

#     print(class1.get_replay_count_all.return_value)
#     print(returned_schema)



#     # from unittest.mock import MagicMock
#     # thing = Database(mock=True)
#     # thing.get_replay_count_all = MagicMock(return_value=14)

#     # ... StatsClass(db=thing)

#     # from unittest.mock import MagicMock
#     # thing = ProductionClass()
#     # thing.method = MagicMock(return_value=3)
#     # thing.method(3, 4, 5, key='value')
#     # 3
#     # thing.method.assert_called_with(3, 4, 5, key='value')

#     # with patch("config.database.Database") as mock:
#     #     mock.get_replay_count_all.return_value = 14
#     #     print(mock.get_replay_count_all.return_value)
#     #     returned_schema = StatsClass(db = mock).get_replay_count_all()
#     #     print(mock.get_replay_count_all.return_value)
#     #     print(returned_schema)
#     #     assert returned_schema == CountSchema(count = 14)

#         # assert returned_schema.count == mock.get_replay_count_all.return_value

#     # mock = patch("config.database.Database")

#     # mock.get_replay_count_all.return_value = 13
#     # returned_schema = StatsClass(db = mock).get_replay_count_all()

#     # assert mock.get_replay_count_all.return_value == return_schema.count

#     # with patch("config.database.Database") as mock:
#     #     mock.get_replay_count_all.return_value = 12
#     #     return_schema = StatsClass(db = mock).get_replay_count_all()
#     #     assert returned_schema.count == mock.get_replay_count_all.return_value

# test_get_replay_count_all()