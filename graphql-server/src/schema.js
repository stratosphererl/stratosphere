const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getRandomPlayer: Player!
        getPlayers: [Player!]!
        getPlayer(username: String): Player
        getModels: [Model!]!
    }

    type Mutation {
        addPlayer(username: String): Boolean
        makePrediction(model: String): Prediction
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