const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PORT = 4000

// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//       host : 'localhost',
//       port : 5432,
//       user : 'postgres',
//       password : 'mynewpassword',
//       database : 'stratosphere'
//     }
// });

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    // context: ({ req, res }) => {
    //     return { req, res, knex };
    // }
})

server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});