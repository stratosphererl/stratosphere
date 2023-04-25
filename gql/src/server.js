const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { typeDefs, resolvers } = require("./schemas/schema");
const { GQL_SERVICE_PORT } = require("./config/datasources");

async function startServer() {
  const server = new ApolloServer({
    csrfPrevention: true,
    cache: "bounded",
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: GQL_SERVICE_PORT }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startServer();
