const { ApolloServer, gql } = require('apollo-server');

const replays = [
    {
        "id": "replay-01",
        "url": "https://static.wikia.nocookie.net/1d45d1a8-3e88-47e1-9e07-78f21f9d8ea7/scale-to-width/755"
    },
    {
        "id": "replay-02",
        "url": "https://img.buzzfeed.com/buzzfeed-static/static/2021-01/20/23/asset/9e2b6c32d7df/anigif_sub-buzz-20009-1611185881-21.gif"
    },
]

const typeDefs = gql`
    type Query {
        replays: [Replay!]!
    }

    type Replay {
        id: ID!
        url: String!
    }

    type Mutation {
        newReplay(id: ID!, url: String!):Replay
    }
`;

const resolvers = {
    Query: {
        replays: () => replays
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded'
})

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});