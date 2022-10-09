const fs = require('fs').promises;
const path = require('node:path');
const replays = require('../data/replays')
const fetch = require('node-fetch');

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
        getRandomPlayer: async () => await getRandomPlayer(),
        getPlayers: async () => await getPlayers(),
        getPlayer: async (_, {username}) => await getPlayer(username),
        getModels: async () => {
            const response = await fetch('http://localhost:5002/ml_models', {method: 'GET', redirect : 'follow'});
            const data = await response.json();
            return data.map((model) => {return {name: model}})
        },
    },

    Mutation: {
        addPlayer: async (_, {username}) => {
            try {
                await fs.appendFile(path.join('data', 'users.txt'), `\n${username}`);
            } catch(error){
                throw error;
            }
        },
        makePrediction: async (_, {model}) => {
            const input = Math.round(Math.random()*1000);
            const response = await fetch(`http://localhost:5002/ml_models/${model}/${input}`, {method: 'GET', redirect : 'follow'});
            const data = await response.json();
            return {guess: parseFloat(data)};
        },
        setReplay: async (_, {replay_file}, {knex}) => {
            // const response = await fetch('http://localhost:5001/parse/', {
            //     method: 'POST',
            //     redirect : 'follow',
            //     body: replay_file,
            //     headers: {'Content-Type': 'application/octet-stream'}
            // });
            // const data = await response.json();
            
            /*
            INSERT INTO replay (filename, datavalue)
            VALUES ('\Novarchite_20220927215828.replay', 12);
            */
            // translate sql insert to knex syntax
            const data = await knex('replay').insert({filename: "turd", datavalue: 12});
            return {file: data};
        }
    }
};

module.exports = resolvers;