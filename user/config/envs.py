import dotenv
import shutil, os, pathlib

ENV_PATH = ".env"

dotenv.load_dotenv(dotenv_path=ENV_PATH)


if not os.getenv("DOCKER_RUNNING"):
    # running locally means our .env wasn't mounted
    path = pathlib.Path(__file__).parent.absolute()
    shutil.copyfile(path.parent.parent / ".env", path.parent / ".env")

# Add your environment variables names here
USER_SERVICE_VAR_NAME = "USER_SERVICE_NAME"
USER_SERVICE_VAR_PORT_NAME = "USER_SERVICE_PORT"

USER_DB_VAR_HOST_NAME = "USER_DB_HOST"
USER_DB_VAR_NAME = "USER_DB_HOST"
USER_DB_VAR_USER_NAME = "USER_DB_USER"
USER_DB_VAR_PASSWORD_NAME = "USER_DB_PASSWORD"
USER_DB_VAR_PORT_NAME = "USER_DB_PORT"

SECRET_KEY_NAME = "USER_SECRET_KEY"
ENCODER_ALGORIGHTM_NAME = "USER_ENCODE_ALGORITHM"