FROM node:15
WORKDIR /stratosphere-client
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY package.json pnpm-lock.yaml .
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "start"]