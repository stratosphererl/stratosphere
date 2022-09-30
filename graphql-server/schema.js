const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getReplays: [Replay!]!
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

    type Subscription {
        newPlayer: Player!
    }
`;

module.exports = typeDefs;