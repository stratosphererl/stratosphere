const fs = require('fs').promises;
const path = require('node:path');

const getRandomPlayer = async () => {
    const buff = await fs.readFile(path.join('data', 'users.txt'), "utf-8");

    const lines = buff.split("\n");
    const player = lines[Math.floor(Math.random()*lines.length)].trim();

    return player;
};

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
        replays: async () => await replays.map(async (replay) => {
            const rando = await getRandomPlayer();
            return {...replay, player: rando};
        }),
    }
};

module.exports = resolvers;