# User Service

The user service stores aggregate information on a per user basis. For each user we will record the number of replays, wins, losses, goals, shots, saves, and more. Using fast api the user and the frontend can interact with this information through various CRUD operations. Note: only the read operations are done by anyone, other actions will require authentication.

## Structure

This folder is broken up into:

- `../config`: contains environment variables, database, and sql files
- `../routers`: contains the routers of the service's api
- `../schemas`: contains the schemas for your data
- `../services`: contains the business logic of your service
- `../tests`: contains both the unit tests and integration tests
- `../util`: contains helper classes for handling responses 

## Environment Variables

To run this project, you will need to add the following environment variables to your `/user-service/.env` file and `/.env` file

`USER_SERVICE_NAME`

`USER_SERVICE_PORT`

`USER_DB_HOST`

`USER_DB_NAME`

`USER_DB_USER`

`USER_DB_PASSWORD`

`USER_DB_PORT`

_note: The next two are only needed in the `/.env` file_

`USER_SECRET_KEY` -- I don't know all the algorithms, I would suggest: "HS256"

`USER_ENCODE_ALGORITHM` -- Should be a random 64 character hexadecimal number

## Using

Regardless of what your doing, you'll need to set the envirenment variables in the .env files. Please read the above section on environment variables if you have not already done so.

### Basic Usage

To start the service, make sure you have docker installed and running. Then run:

```
docker compose up
```

The two services userdb and user-service should start up without a hitch.

### Testing

Befor you begin testing make sure you have the appropriate dependencies installed using pipenv. Inside the service directory run these commands:

```
pip install pipenv
pipenv install
```

Now that you have the appropriate dependencies, you can run the tests using pytest.

Make sure your running in the pipenv shell, if you just ran `pipenv install` this shouldn't be a worry.

```
pipenv shell
```

Now just run the tests with:

```
pytest
```

Thank you for coming to my TED Talk
