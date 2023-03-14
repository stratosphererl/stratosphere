import dotenv
import os, pathlib, shutil

ENV_PATH = ".env"
dotenv.load_dotenv(dotenv_path=ENV_PATH)

if not os.getenv("DOCKER_RUNNING"):
    # running locally means our .env wasn't mounted
    path = pathlib.Path(__file__).parent.absolute()
    shutil.copyfile(path.parent.parent / ".env", path.parent / ".env")

# TODO: Add your environment variables names here
SERVICE_VAR_NAME = "STATS_SERVICE_NAME"
SERVICE_VAR_PORT_NAME = "STATS_SERVICE_PORT"

DB_VAR_HOST_NAME = "STATS_DB_HOST"
DB_VAR_HOST_NAME_TEST = "STATS_DB_HOST_TEST"
DB_VAR_NAME = "STATS_DB_NAME"
DB_VAR_USER_NAME = "STATS_DB_USER"
DB_VAR_PASSWORD_NAME = "STATS_DB_PASSWORD"
DB_VAR_PORT_NAME = "STATS_DB_PORT"