const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        replays: [Replay!]!
    }

    type Replay {
        id: ID!
        url: String!
        player: String!
    }
`;

module.exports = typeDefs;