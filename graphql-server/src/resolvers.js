const fs = require('fs').promises;
const path = require('node:path');
const replays = require('../data/replays')

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

const resolvers = {
    Query: {
        replays: () => replays.map(async (replay) => {
            const rando = await getRandomPlayer();
            return {...replay, player: rando};
        }),
        getRandomPlayer: async () => await getRandomPlayer(),
        getPlayers: async () => await getPlayers(),
        getPlayer: async (_, {username}) => await getPlayer(username)
    },

    Mutation: {
        addPlayer: async (_, {username}) => {
            try {
                await fs.appendFile(path.join('data', 'users.txt'), `\n${username}`);
            } catch(error){
                throw error;
            }
        }
    }
};

module.exports = resolvers;