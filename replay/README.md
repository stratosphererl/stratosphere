
# Service Example

A brief description of what this project does and who it's for

This folder is broken up into:

- `../config`: contains environment variables, database, and sql files
- `../routers`: contains the routers of the service's api
- `../schemas`: contains the schemas for your data
- `../services`: contains the business logic of your service
- `../tests`: contains both the unit tests and integration tests
- `../util`: contains helper classes for handling responses 

## Environment Variables

To run this project, you will need to add the following environment variables to your config/.env file

`SERVICE_NAME`

`SERVICE_PORT`

`DB_HOST`

`DB_NAME`

`DB_USER`

`DB_PASSWORD`

## Dockerfile

You will also need to change your port number, to the one you have in your env file