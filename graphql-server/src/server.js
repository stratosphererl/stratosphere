const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PORT = 4000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded'
})

server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});