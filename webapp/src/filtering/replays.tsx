import { useEffect, useRef } from "react"

const replayArray = [
    {
        title: "shotsferdays",
        uploaded: "Nov 23rd, 2022 (07:13pm GMT)",
        played: "Dec 6th, 2019 (03:23am GMT)",
        uploader: "OliverCromwell (Epic)",
        arena: "Beckwith Park",
        rank: "GOLD I",
        duration: "3:03 FF (no OT)",
        season: "Legacy 11",
        gamemode: "Snow Day",
        gametype: "Standard (3v3)",
        blue: {
            name: "BLUE",
            score: 6,
            players: ["OliverCromwell", "d1sc0unt", "Rety", ""]
        },
        orange: {
            name: "ORANGE",
            score: 0,
            players: ["Sekirado", "[]][[[][][]]]]", "UoUoUoUoUX", ""]
        },
        winner: 1,
        last: false
    },
    {
        title: "93284239R89FJ23J8032",
        uploaded: "Nov 23rd, 2022 (04:54am GMT)",
        played: "Aug 2nd, 2021 (12:41pm GMT)",
        uploader: "RLCS_Markus (Steam)",
        arena: "Mannfield",
        rank: "CHAMPION I",
        duration: "5:42 (+2:07 OT)",
        season: "Free-to-Play 7",
        gamemode: "Soccar",
        gametype: "Doubles (2v2)",
        blue: {
            name: "CRAZY1",
            score: 2,
            players: ["Frank", "Julien", "", ""]
        },
        orange: {
            name: "REAL RL",
            score: 3,
            players: ["Rewondo", "Rejutop", "FeDeReR", "..."]
        },
        winner: 0,
        last: false
    },
    {
        title: "Homage to Brazil",
        uploaded: "Sep 10th, 2022 (11:37am GMT)",
        played: "Sep 8th, 2022 (10:39pm GMT)",
        uploader: "Chicken935 (Epic)",
        arena: "Deadeye Canyon",
        rank: "CHAMPION I",
        duration: "7:02 (no OT)",
        season: "Free-to-Play 7",
        gamemode: "Soccar",
        gametype: "Standard (3v3)",
        blue: {
            name: "BLUE",
            score: 1,
            players: ["Anthology", "PixelPixeus", "Chicken935", ""]
        },
        orange: {
            name: "ORANGE",
            score: 7,
            players: ["xX_Richard_Xx", "DoubleDabloon", "Retals", "Fezzan"]
        },
        winner: 0,
        last: false
    },
    {
        title: "Flip Reset to Musty",
        uploaded: "Nov 17th, 2022 (03:12am GMT)",
        played: "Nov 15th, 2022 (11:13pm GMT)",
        uploader: "Novarchite (Steam)",
        arena: "Beckwith Park",
        rank: "UNRANKED",
        duration: "5:13 (no overtime)",
        season: "Free-to-Play 8",
        gamemode: "Soccar",
        gametype: "Duels (1v1)",
        blue: {
            name: "BLUE",
            score: 1,
            players: ["Chicken935", "", "", ""]
        },
        orange: {
            name: "ORANGE",
            score: 0,
            players: ["Novarchite", "", "", ""]
        },
        winner: 1,
        last: true
    }
    ]

export default replayArray