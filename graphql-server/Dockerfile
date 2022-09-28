FROM node:16.17
WORKDIR /gql-server
COPY package.json /gql-server
COPY . /gql-server
RUN yarn install
CMD ["yarn", "start"]