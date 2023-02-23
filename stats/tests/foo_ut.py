from services.service import StatsClass
from unittest.mock import patch

def foo(x):
    return x + 1

def test_foo():
    assert foo(0) == 1
    assert foo(1) == 2

def test_get_replay_count_all():
    with patch("config.database.Database") as mock:
        mock.get_replay_count_all.return_value = 12
    
    print(StatsClass().get_replay_count_all())

test_get_replay_count_all()