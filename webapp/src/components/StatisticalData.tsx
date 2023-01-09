import { useEffect, useRef, useState } from "react"
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'
import json from '../json/analysis.json'

let currTotalTime = 0
let currAttTime = 0
let currNeuTime = 0
let currDefTime = 0

export function getVerticalData(player: any) {
    currAttTime = player.stats.positionalTendencies.timeInAttackingThird
    currNeuTime = player.stats.positionalTendencies.timeInNeutralThird
    currDefTime = player.stats.positionalTendencies.timeInDefendingThird
    currTotalTime = player.timeInGame

    return ("")
}

export function VerticalSeparatorBar() {
    return (
        <div className="h-44 w-0.5 flex align-middle justify-center mt-2 bg-[#18A0FB]"></div>
    )
}

function delay(time: number, value: any) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, time*1000);
    });
  }

//     let json : any = await delay(3, jsonImport)

export default function StatisticalData({width = 1280, height = 720}: {width?: number, height?: number}) { // async
    const orangeScore = json.gameMetadata.score.team1Score
    const blueScore = json.gameMetadata.score.team0Score

    const duration = json.gameMetadata.length

    const playerList = json.players
    const numPlayers = playerList.length
    let orangeTeam: any[] = []
    let blueTeam: any[] = []

    playerList.forEach(
        (player: any) => 
            player.isOrange === 1 ?
            orangeTeam.push(player) :
            blueTeam.push(player)
    )

   return (
    <div>
        <div className="text-montserrat h-full bg-[#191919] justify-center">
            <div className="w-full flex items-center justify-center">
                <div className="text-4xl w-4/6 h-12 flex flex-nowrap-36 items-center justify-center bg-[#333333] mt-3 mb-3 ml-3 mr-3 border-2 border-[#222222]">{json.gameMetadata.name}</div>
                <button type="button" className="w-1/6 h-12 text-2xl border-2 align-middle border-[#ffffff] bg-[#18A0FB] mr-3">3D View</button>
                <button type="button" className="w-1/6 h-12 text-2xl border-2 align-middle border-[#18A0FB] bg-[#ffffff] text-[#18A0FB] mr-3">Share</button>
            </div>
            <div className="w-full flex">
                <div className="w-4/6 h-48 flex align middle bg-[#333333] ml-3 mb-3 mr-3 border-2 border-[#222222]">

                    <div className="text-5xl w-2/6 flex flex-wrap items-center justify-center ">
                    {
                            blueScore > orangeScore ?
                            <div className="blue-stroke-2 w-full flex flex-wrap items-end justify-center h-1/2 mb-2"><strong>{blueScore} - {orangeScore}</strong></div> :
                            <div className="orange-stroke-2 w-full flex flex-wrap items-end justify-center h-1/2 mb-2"><strong>{orangeScore} - {blueScore}</strong></div>
                    }
                        <div className="text-xl w-full flex flex-wrap items-start justify-center h-1/2 mt-2">--RANK HERE--</div>
                    </div>


                    <VerticalSeparatorBar/>

                    <div className="text-xl w-3/6 h-44 flex flex-wrap items-center justify-center mt-1 ">
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

                <div className="w-1/6 h-48 align middle bg-[#333333] mb-3 mr-3 justify-center border-2 border-[#222222]">
                    <div className="w-full h-4 flex justify-center text-xl mt-2 blue-stroke-2 mb-3">BLUE</div>
                    {
                        blueTeam.map((player: any) => <div className="w-full h-6 flex justify-center text-sm">{player.name}</div>)
                    }
                </div>

                <div className="w-1/6 h-48 align middle bg-[#333333] mb-3 mr-3 justify-center border-2 border-[#222222]">
                    <div className="w-full h-4 flex justify-center text-xl mt-2 orange-stroke-2 mb-3">ORANGE</div>
                    {
                        orangeTeam.map((player: any) => <div className="w-full h-6 flex justify-center text-sm">{player.name}</div>)
                    }
                </div>
            </div>

            <div className="flex flex-nowrap">
                <div className="ml-3 w-1/6 bg-[#191919] mt-0.5">
                    <div className="h-8 border-r-2 border-[#222222]"></div>
                    <div className="h-8 bg-[#333333] flex items-center justify-center border-t-2 border-l-2 border-[#222222]"><strong>Score</strong></div>
                    <div className="h-8 bg-[#444444] flex items-center justify-center border-l-2 border-[#222222]"><strong>Goals</strong></div>
                    <div className="h-8 bg-[#333333] flex items-center justify-center border-l-2 border-[#222222]"><strong>Assists</strong></div>
                    <div className="h-8 bg-[#444444] flex items-center justify-center border-l-2 border-[#222222]"><strong>Saves</strong></div>
                    <div className="h-8 bg-[#333333] flex items-center justify-center border-l-2 border-[#222222]"><strong>Shots</strong></div>
                    <div className="h-8 bg-[#444444] flex items-center justify-center border-l-2 border-[#222222]"><strong>Player of Match</strong></div>
                    <div className="h-48 bg-[#333333] flex flex-wrap items-center justify-center border-l-2 border-b-2 border-[#222222]">
                        <div className="flex justify-center text-center">
                            <strong>Vertical Positioning</strong>
                        </div>
                    </div>
                </div>
                <div className="mr-3 h-64 w-5/6 bg-[#333333]">
                    {/* For each player, have w-1/2 column, or create grid with num cols equal to num players, one row */}

                    { 
                        // playerList.length === 8 ?
                        // <div className="grid grid-cols-8 border-r-2 border-[#222222]">
                        <div className={`grid grid-cols-${playerList.length} border-r-2 border-[#222222]`}>
                            {
                                playerList.map((player: any) =>
                                    <div>
                                        {getVerticalData(player)}
                                        <div className="justify-center border-t-2 border-[#222222]">
                                            <div className="flex items-center justify-center h-8 flex-wrap truncate text-center"><strong>{player.name}</strong>
                                            {
                                                player.isOrange === 1 ?
                                                <div className="w-full flex justify-center">
                                                    <div className="h-0.5 w-5/6 bg-[#FF6A00]"></div>
                                                </div>
                                                :
                                                <div className="w-full flex justify-center">
                                                    <div className="h-0.5 w-5/6 bg-[#18A0FB]"></div>
                                                </div>
                                            }
                                            </div>
                                        </div>
                                        <div className="flex justify-center h-8 border-l-2 border-[#333333]">
                                            <div className="flex items-center h-8">{player.score}</div>
                                        </div>
                                        <div className="flex justify-center h-8">
                                            <div className="flex items-center h-8 bg-[#444444] w-full justify-center">{player.goals}</div>
                                        </div>
                                        <div className="flex justify-center h-8">
                                            <div className="flex items-center h-8">{player.assists}</div>
                                        </div>
                                        <div className="flex justify-center h-8">
                                            <div className="flex items-center h-8 bg-[#444444] w-full justify-center">{player.saves}</div>
                                        </div>
                                        <div className="flex justify-center h-8">
                                            <div className="flex items-center h-8">{player.shots}</div>
                                        </div>
                                        {
                                            player.id.id === json.gameMetadata.primaryPlayer.id ?
                                            <div className="flex justify-center h-8">
                                                <div className="flex items-center h-8 bg-[#444444] w-full justify-center">YES</div>
                                            </div>
                                            :
                                            <div className="flex justify-center h-8">
                                                <div className="flex items-center h-8 bg-[#444444] w-full justify-center">-</div>
                                            </div>
                                        }
                                        <div className="flex w-full justify-center h-48 bg-[#333333] border-b-2 border-[#222222]">
                                            <div className="flex flex-wrap w-full items-center justify-center">
                                                <div className="text-xs h-6 w-10/12 mt-1 bg-[#444444] border-2 flex justify-center items-center">Offense</div>
                                                <div className="h-8 w-11/12 bg-[#444444] border-2 border-[#ffffff] flex justify-center items-center">
                                                    {Math.round(currAttTime / currTotalTime * 10000) / 100 + "%"}
                                                </div>
                                                <div className="h-8 w-11/12 bg-[#444444] border-2 border-[#ffffff] flex justify-center items-center">
                                                    {Math.round(currNeuTime / currTotalTime * 10000) / 100 + "%"}
                                                </div>
                                                <div className="h-8 w-11/12 bg-[#444444] border-2 border-[#ffffff] flex justify-center items-center">
                                                    {Math.round(currDefTime / currTotalTime * 10000) / 100 + "%"}
                                                </div>
                                                <div className="text-xs h-6 w-10/12 mb-1 bg-[#444444] border-2 flex justify-center items-center">Defense</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>//:<div></div>
                    }
                </div>
            </div>
        </div>
        <div className="bg-[#191919] h-3"></div>
    </div>
   )
}