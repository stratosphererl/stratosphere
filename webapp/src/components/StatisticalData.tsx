import { useEffect, useRef, useState } from "react"
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'
import json from '../json/analysis.json'

// GET request for reading json object, select name for json

const orangeScore = json.gameMetadata.score.team1Score
const blueScore = json.gameMetadata.score.team0Score

const duration = json.gameMetadata.length

const playerList = json.players
let orangeTeam: any[] = []
let blueTeam: any[] = []

// Could use <list>.filter

playerList.forEach(
    (player: any) => 
        player.isOrange === 1 ?
        orangeTeam.push(player) :
        blueTeam.push(player)
)

let i = orangeTeam.length
while (i < 8) {
    orangeTeam = orangeTeam.concat([])
    i = i + 1
}

type PositionBox = {
    location: string
    color: string,
    percent: number,
}

type Player = {
    username: string,
    score: number,
    goals: number,
    assists: number,
    saves: number,
    shots: number,
    pom: boolean,
    isOrange: boolean,
    boxes: [],
}

export function VerticalSeparatorBar() {
    return (
        <div className="h-44 w-0.5 flex align-middle justify-center mt-2 bg-[#18A0FB]"></div>
    )
}

export default function StatisticalData({width = 1280, height = 720}: {width?: number, height?: number}) {
   return (
    <div className="text-montserrat bg-[#191919] justify-center">
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl w-4/6 h-12 flex flex-nowrap-36 items-center justify-center bg-[#333333] mt-3 mb-3 ml-3 mr-3">{json.gameMetadata.name}</div>
            <button type="button" className="w-1/6 h-12 text-2xl border-2 align-middle border-[#ffffff] bg-[#18A0FB] mr-3">3D View</button>
            <button type="button" className="w-1/6 h-12 text-2xl border-2 align-middle border-[#18A0FB] bg-[#ffffff] text-[#18A0FB] mr-3">Share</button>
        </div>
        <div className="w-full flex">
            <div className="w-4/6 h-48 flex align middle bg-[#333333] ml-3 mb-3 mr-3">

                <div className="text-5xl w-2/6 flex flex-wrap items-center justify-center">
                {
                        blueScore > orangeScore ?
                        <div className="blue-stroke-2 w-full flex flex-wrap items-end justify-center h-1/2 mb-2"><strong>{blueScore} - {orangeScore}</strong></div> :
                        <div className="orange-stroke-2 w-full flex flex-wrap items-end justify-center h-1/2 mb-2"><strong>{orangeScore} - {blueScore}</strong></div>
                }
                    <div className="text-xl w-full flex flex-wrap items-start justify-center h-1/2 mt-2">--RANK HERE--</div>
                </div>


                <VerticalSeparatorBar/>

                <div className="text-xl w-3/6 h-44 flex flex-wrap items-center justify-center mt-1">
                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Uploaded</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">--DATE HERE--</div>

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Played</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">--DATE HERE--</div>

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Uploader</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">--UPLOADER HERE--</div>

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Arena</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center mb-1">{json.gameMetadata.map}</div>
                </div>

                <VerticalSeparatorBar/>

                <div className="text-xl w-3/6 h-44 flex flex-wrap items-center justify-center mt-1">

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Duration</strong></div>
                    {
                        Math.floor(duration) % 60 < 10 ?
                        <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">{Math.floor(duration / 60)}:0{Math.floor(duration) % 60}</div> :
                        <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">{Math.floor(duration / 60)}:{Math.floor(duration) % 60}</div>
                    }

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Season</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">--SEASON HERE--</div>

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Gamemode</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">--GAMEMODE HERE--</div>

                    <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>Gametype</strong></div>
                    <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center mb-1">{json.gameMetadata.playlist}</div>
                </div>

            </div>

            {/* Potentially implement switching blue and orange player columns based on final score */}

            {/* Gather players from each team and create player type objects for each */}

            <div className="w-1/6 h-48 align middle bg-[#333333] mb-3 mr-3 flex flex-wrap items-center justify-center">
                <div className="w-full h-4 flex justify-center text-xl mt-2 blue-stroke-2">BLUE</div>
                <div className="w-full h-4 flex justify-center text-sm mt-2">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm mb-3">TEST</div>
            </div>

            <div className="w-1/6 h-48 align middle bg-[#333333] mb-3 mr-3 justify-center">
                <div className="w-full h-4 flex justify-center text-xl mt-2 orange-stroke-2 mb-3">ORANGE</div>

                {
                    orangeTeam.map((player: any) => <div className="w-full h-6 flex justify-center text-sm">{player.name}</div>)
                }

                {/* <div className="w-full h-4 flex justify-center text-sm mt-2">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm">TEST</div>
                <div className="w-full h-4 flex justify-center text-sm mb-3">TEST</div> */}
            </div>
        </div>
    </div>
   )
}

{/* <div>SCORE #1: {json.gameMetadata.score.team0Score}</div>
        <div>SCORE #2: {json.gameMetadata.score.team1Score}</div>
        <div>NAME: {json.gameMetadata.name}</div>
        <div>ARENA: {json.gameMetadata.map}</div>
        <div>DURATION: {json.gameMetadata.length}</div>
        <div>GAMEMODE/GAMETYPE: {json.gameMetadata.playlist}</div> */}

// <div className="text-montserrat w-full bg-[#191919] flex flex-nowrap">

    //     <div className="flex-wrap">
    //         <div className="text-2xl w-full bg-[#333333]">"{json.gameMetadata.name}" - Full Data</div>
    //         <button type="button" className="w-4/6 h-1/4 text-sm border-2 align-middle border-[#ffffff] bg-[#18A0FB]">Full Data</button>
    //     </div>
    // </div>