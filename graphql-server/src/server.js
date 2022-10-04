const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
// const resolvers = require('./resolvers');
// imports for subscriptions
const express = require('express')
const { createServer } = require('http');
const {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} = require("apollo-server-core");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');
//const { Solvers } = require('./solvers');


const fs = require('fs').promises;
const path = require('node:path');
/*
    Get all players from data/users.txt
*/
const getPlayers = async () => {
    const buff = await fs.readFile(path.join('data', 'users.txt'), "utf-8");
    const lines = buff.split("\n");

    // clean player names and coerce to schema format before returning
    return lines.map(line => {
        const username = line.trim();
        return {username: username};
    })
}

/*
    Set a new player in data/users.txt
*/
const setPlayer = async (username) => {
    try {
        await fs.appendFile(path.join('data', 'users.txt'), `\n${username}`);
        return {username};
    } catch(error){
        throw error;
    }
}

/*
    Get random player from data/users.txt
*/
const getRandomPlayer = async () => {
    const players = await getPlayers();
    const player = players[Math.floor(Math.random()*players.length)];
    return player;
};

/*
    Get a player with a specific username from data/users.txt
*/
const getPlayer = async (username) => {
    const players = await getPlayers();
    // find player, else return empty object
    const player = players.find((player) => player.username === username) || {username: ""};
    return player;
}

const replays = [
    {
        "id": "replay-01",
        "url": "https://static.wikia.nocookie.net/1d45d1a8-3e88-47e1-9e07-78f21f9d8ea7/scale-to-width/755",
    },
    {
        "id": "replay-02",
        "url": "https://img.buzzfeed.com/buzzfeed-static/static/2021-01/20/23/asset/9e2b6c32d7df/anigif_sub-buzz-20009-1611185881-21.gif",
    },
]

/*
Used to keep track of all the available events the API offers
*/
const eventRegistry = {
    NEW_USER: "NEW_PLAYER"
}

// const resolvers = {
//     Query: {...Solvers.Query},

//     Mutation: {
//         addPlayer: async (_, {username}, {pubsub}) => {
//             // trigger event
//             try{
//                 const player = await setPlayer(username);
//                 pubsub.publish(eventRegistry.NEW_USER, {newPlayer: player});
//                 return true;
//             } catch(_) {
//                 return false;
//             }
//         }
//     },

//     Subscription: {
//         newPlayer: {
//             subscribe: () => pubsub.asyncIterator(eventRegistry.NEW_USER)
//         }
//     }
// };


const resolvers = {
    Query: {
        getReplays: () => replays.map(async (replay) => {
            const rando = await getRandomPlayer();
            return {...replay, player: rando};
        }),
        getRandomPlayer: async () => await getRandomPlayer(),
        getPlayers: async () => await getPlayers(),
        getPlayer: async (_, {username}) => await getPlayer(username)
    },

    Mutation: {
        addPlayer: async (_, {username}, {pubsub}) => {
            // trigger event
            try{
                const player = await setPlayer(username);
                pubsub.publish(eventRegistry.NEW_USER, {newPlayer: player});
                return true;
            } catch(_) {
                return false;
            }
        }
    },

    Subscription: {
        newPlayer: {
            subscribe: () => pubsub.asyncIterator(eventRegistry.NEW_USER)
        }
    }
};




const schema = makeExecutableSchema({ typeDefs, resolvers })
const PORT = 3000
const pubsub = new PubSub();


const startApolloServer = async (typeDefs, resolvers) => {
    // boiler plate express app
    const app = express()

    // This `app` is the returned value from `express()`.
    const httpServer = createServer(app);

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                  return {
                    async drainServer() {
                      await serverCleanup.dispose();
                    },
                  };
                },
              },
            // not entirely sure what this does quite yet...
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
          ],
          context: () => ({pubsub})
    })

     // Creating the WebSocket server
     const subscriptionServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if your ApolloServer serves at
        // a different path.
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, subscriptionServer);

    await server.start();
    server.applyMiddleware({ app });

    httpServer.listen(PORT, () => {
        console.log(
          `🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`,
        );
      });
}

startApolloServer(typeDefs, resolvers)