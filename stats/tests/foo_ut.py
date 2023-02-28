from services.service import StatsClass
from unittest.mock import patch
from unittest.mock import Mock
from unittest.mock import MagicMock
from config.database import Database
from schemas.schema import CountSchema
import subprocess as sp
import os
import tarfile
import docker

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

def remove_files_from_docker(filenames):
    for filename in filenames:
        os.system("docker exec " + str(container_id) + " rm -rf " + filename.split("/",1)[-1])

client = docker.from_env()
container_id = sp.getoutput("docker ps -aqf name=statsdb")

##---- Testing database.py ----##

def test_database_get_replay_count_all():
    assert db.get_replay_count_all() == 56 # Total number of replays == 56

def test_database_get_replay_count_arena():
    assert db.get_replay_count_arena(3) == 7 # Number of replays with arena num 3 == 7
    assert db.get_replay_count_arena(27) == 41 # Number of replays with arena num 27 == 41
    assert db.get_replay_count_arena(3) + db.get_replay_count_arena(27) == 48 # Adding the two above values results in value == 48

def test_database_get_replay_count_duration():
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 1230) == 37 # Number of replays in duration relation == 37
    assert db.get_replay_count_duration(min_duration = 30, max_duration = 1230) == 25 # Number of replays with duration >= 30s == 25
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 360) == 31 # Number of replays with duration < 360s == 31
    assert db.get_replay_count_duration(min_duration = 0, max_duration = 390) == 33 # Number of replays with duration < 390s == 33
    assert db.get_replay_count_duration(min_duration = 30, max_duration = 600) == 21 # Number of replays with 30s <= duration < 600s == 21
    assert db.get_replay_count_duration(min_duration = 360, max_duration = 300) == 0 # Min > Max, should return 0 always

def test_database_get_replay_count_rank():
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 22) == 56 # Should return the number of all replays which == 56
    assert db.get_replay_count_rank(low_rank_num = 2, high_rank_num = 22) == 53 # Returns number of replays Bronze II and up which == 53
    assert db.get_replay_count_rank(low_rank_num = 17, high_rank_num = 22) == 15 # Returns number of replays Champ II and up which == 15
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 13) == 33 # Returns number of replays Diamond I and below which == 33
    assert db.get_replay_count_rank(low_rank_num = 0, high_rank_num = 20) == 51 # Returns number of replays GrandChamp II and below which == 51
    assert db.get_replay_count_rank(low_rank_num = 10, high_rank_num = 12) == 8 # Returns number of all Platinum replays which == 8
    assert db.get_replay_count_rank(low_rank_num = 15, high_rank_num = 15) == 4 # Returns number of all Diamond III replays which == 4
    assert db.get_replay_count_rank(low_rank_num = 10, high_rank_num = 9) == 0 # low_rank_num > high_rank_num, returns 0

def test_database_get_replay_count_season():
    assert db.get_replay_count_season(low_season_num = 0, high_season_num = 21) == 22 # Should return the number of all replays in relation which == 22
    assert db.get_replay_count_season(low_season_num = 1, high_season_num = 21) == 15 # Returns number of replays from seasons Legacy 2 and onwards which == 15
    assert db.get_replay_count_season(low_season_num = 11, high_season_num = 21) == 11 # Returns the number of replays from season Legacy 12 and onwards which == 11
    assert db.get_replay_count_season(low_season_num = 14, high_season_num = 21) == 10 # Returns the number of replays from any Free-to-Play (FtP) season
    assert db.get_replay_count_season(low_season_num = 19, high_season_num = 21) == 4 # Returns the number of replays from FtP 6 and onwards which == 4
    assert db.get_replay_count_season(low_season_num = 0, high_season_num = 4) == 11 # Returns the number of replays from Legacy 5 and backwards which == 11
    assert db.get_replay_count_season(low_season_num = 8, high_season_num = 20) == 10 # Returns num replays from Legacy 9 to FtP 7 which == 10
    assert db.get_replay_count_season(low_season_num = 15, high_season_num = 15) == 6 # Returns num replays from FtP 2 which == 6

def test_database_get_user_count_all():
    assert db.get_user_count_all() == 74 # Should return the number of all users which == 74

def test_database_get_user_count_platform():
    assert db.get_user_count_platform(0) == 41 # Returns the number of our users from the Steam platform
    assert db.get_user_count_platform(1) == 33 # Returns the number of our users from the Epic Games platform

def test_database_get_user_count_rank():
    assert db.get_user_count_rank(low_rank_num = 0, high_rank_num = 22) == 48 # Should return the total number of users which == 48
    assert db.get_user_count_rank(low_rank_num = 1, high_rank_num = 22) == 40 # Returns the number of users Bronze I and above which == 40
    assert db.get_user_count_rank(low_rank_num = 10, high_rank_num = 22) == 38 # Returns the number of users Platinum I and above which == 38
    assert db.get_user_count_rank(low_rank_num = 21, high_rank_num = 22) == 19 # Returns the number of users GC III or SSL which == 19
    assert db.get_user_count_rank(low_rank_num = 22, high_rank_num = 22) == 17 # Returns the number of users who are SSL == 17
    assert db.get_user_count_rank(low_rank_num = 11, high_rank_num = 11) == 13 # Returns the number of users who are Platinum II which == 13
    assert db.get_user_count_rank(low_rank_num = 4, high_rank_num = 2) == 0 # low_rank_num > high_rank_num, should return 0

# Instantiate test version of Database object
db = Database(test = True)

# Files to pass (..._src) to Docker destination (..._dst)
init_src, init_dst = "/tests/test_init.sql", ":/tmp/test_init.sql"
trmn_src, trmn_dst = "/tests/test_trmn.sql", ":/tmp/test_trmn.sql"

# Pass initialization SQL file to Docker and run it (inputs mock data)
pass_file_to_docker(init_src, init_dst)
run_file_in_docker(init_dst)

# Run all tests, all should pass
test_database_get_replay_count_all()
test_database_get_replay_count_arena()
test_database_get_replay_count_duration()
test_database_get_replay_count_rank()
test_database_get_replay_count_season()
test_database_get_user_count_all()
test_database_get_user_count_platform()
test_database_get_user_count_rank()

# Pass termination SQL file to Docker and run it (removes mock data)
pass_file_to_docker(trmn_src, trmn_dst)
run_file_in_docker(trmn_dst)

# Remove initialization and termination SQL files from Docker container
remove_files_from_docker([init_dst, trmn_dst])










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