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
            try{
                await setPlayer(username);
                return true;
            } catch(_) {
                return false;
            }
        }
    }
};

module.exports = resolvers;