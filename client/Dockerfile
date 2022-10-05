FROM node:16.17
WORKDIR /client
COPY package.json /client
COPY . /client
RUN yarn install
CMD ["yarn", "dev", "--", "--host"]