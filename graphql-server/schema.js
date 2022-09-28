const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        replays: [Replay!]!
        getRandomPlayer: Player!
        getPlayers: [Player!]!
        getPlayer(username: String): Player
    }

    type Replay {
        id: ID!
        url: String!
        player: Player!
    }

    type Player {
        username: String!
    }

    type Mutation {
        addPlayer(username: String): Boolean
    }
`;

module.exports = typeDefs;