const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers } = require("./schemas/schema");
const { GQL_SERVICE_PORT } = require("./config/datasources");

const server = new ApolloServer({
  csrfPrevention: true,
  cache: "bounded",
  typeDefs,
  resolvers,
});

server.listen(GQL_SERVICE_PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
