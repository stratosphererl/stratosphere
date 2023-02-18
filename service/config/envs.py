import dotenv

ENV_PATH = ".env"
dotenv.load_dotenv(dotenv_path=ENV_PATH)

# TODO: Add your environment variables names here
SERVICE_VAR_NAME = "SERICE_NAME"
SERVICE_VAR_PORT_NAME = "SERVICE_PORT"

DB_VAR_HOST_NAME = "DB_HOST"
DB_VAR_NAME = "DB_NAME"
DB_VAR_USER_NAME = "DB_USER"
DB_VAR_PASSWORD_NAME = "DB_PASSWORD"
DB_VAR_PORT_NAME = "DB_PORT"