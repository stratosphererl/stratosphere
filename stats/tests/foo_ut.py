from services.service import StatsClass
from unittest.mock import patch
from config.database import Database

def test_get_replay_count_all():
    # db = Database(test = True)

    with patch("config.database.Database") as mock:
        mock.get_replay_count_all.return_value = 12
        returned_schema = StatsClass(db = mock).get_replay_count_all()
        assert returned_schema.count == mock.get_replay_count_all.return_value

test_get_replay_count_all()