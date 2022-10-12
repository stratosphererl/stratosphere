const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getRandomPlayer: Player!
        getPlayers: [Player!]!
        getPlayer(username: String): Player
        getModels: [Model!]!
        makePrediction(model: String): Prediction
    }

    type Mutation {
        addPlayer(username: String): Boolean
        setReplay(replay: String): Replay
    }

    type Replay {
        file: String!
    }

    type Prediction {
        guess: Float!
    }

    type Player {
        username: String!
    }

    type Model {
        name: String!
    }
`;

module.exports = typeDefs;