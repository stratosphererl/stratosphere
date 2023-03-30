FROM node:16.17

ENV DOCKER_RUNNING=true

WORKDIR /gql-server
COPY ./gql/package.json /gql-server
COPY ./gql/. /gql-server

RUN npm install

# Copy the rest of the application code to the container
COPY .env ./

EXPOSE 4000
CMD ["npm", "run", "start"]