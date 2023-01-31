import { ReactNode, useEffect, useRef, useState } from "react"
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'
import json from '../json/analysis.json'

// Modify these to change colors of theme used in this file
const primaryBackgroundColor = "444444"
const secondaryBackgroundColor = "333333"
const tertiaryBackgroundColor = "191919"
const dataBorderColor = "ffffff"
const boxBorderColor = "222222"
const blueTeamColor = "18A0FB"
const orangeTeamColor = "FF6A00"
//

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
        <div className="flex items-center">
            <div className="h-44 w-0.5 flex align-middle justify-center bg-[#18A0FB]"></div>
        </div>
    )
}

function delay(time: number, value: any) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, time*1000);
    });
  }

  export function Button(props: {width: string, height: string, text: string, borderColor: string, bgColor: string}) {
    const widthStr = "w-" + props.width
    const heightStr = "h-" + props.height
    const borderStr = "border-[#" + props.borderColor +"]"
    const bgStr = "bg-[#" + props.bgColor + "]"
    const textColorStr = "text-[#" + props.borderColor + "]"
    
    const classNameString = widthStr + " " + heightStr + " " + borderStr + " " + bgStr + " " + textColorStr + " text-2xl border-2 align middle mr-3"

    return (
        <button type="button" className={classNameString}>{props.text}</button>
    )
}

export function Score(props: {leftScore: number, rightScore: number, winner: string}) {
    const classNameString = props.winner + "-stroke-2 w-full flex flex-wrap items-end justify-center h-1/2 mb-2"

    return (
        <div className={classNameString}><strong>{props.leftScore} - {props.rightScore}</strong></div>
    )
}

// {/* I believe the below function has been refactored as much as it can be */}
export function MetadataColumn(props: {titles: string[], metadata: string[]}) {
    return (
        <div className="text-xl w-3/6 h-44 flex flex-wrap items-center justify-center">
            {
                props.titles.reduce( (acc: ReactNode[], title, idx) => {
                    acc.push([
                        <MetadataEntryTitle str={title}/>,
                        <MetadataEntryData str={props.metadata[idx]}/>
                    ]);
                    return acc;
                }, [])
            }
        </div>
    )
}

export function MetadataEntryTitle(props: {str: string}) {
    return (
        <div className="w-full h-0.5 flex flex-wrap text-sm items-center justify-center"><strong>{props.str}</strong></div>
    )
}
export function MetadataEntryData(props: {str: string}) {
    return (
        <div className="w-full text-[#BBBBBB] h-1.5 flex flex-wrap text-sm items-center justify-center">{props.str}</div>
    )
}

export function VariableBlock(props: {text: string, height: number, bgColor: string, topBorderWidth: number, leftBorderWidth: number, bottomBorderWidth: number}) {
    const heightString = "h-" + props.height
    const bgString = "bg-[#" + props.bgColor + "]"
    const topBorder = "border-t-" + props.topBorderWidth
    const leftBorder = "border-l-" + props.leftBorderWidth
    const bottomBorder = "border-b-" + props.bottomBorderWidth

    const classNameString = heightString + " " + bgString + " " + topBorder + " " + leftBorder + " " + bottomBorder + " flex items-center justify-center border-[#222222]";

    return (
        <div className={classNameString}><strong>{props.text}</strong></div>
    )
}

export function DataBlock(props: {data: any, bgColor: string}) {
    const bgString = "bg-[#" + props.bgColor + "]"

    const classNameString = bgString + " flex items-center h-8 w-full justify-center"

    return (
        <div className="flex justify-center h-8">
            <div className={classNameString}>{props.data}</div>
        </div>
    )
}

export function NameUnderline(props: {bgColor: string}) {
    const bgString = "bg-[#" + props.bgColor + "]"

    const classNameString = bgString + " h-0.5 w-5/6"

    return (
        <div className="w-full flex justify-center">
            <div className={classNameString}></div>
        </div>
    )
}

export function VerticalPositioningDataBox(props: {numerator: number, denominator: number, bgColor: string, borderColor: string}) {
    const bgString = "bg-[#" + props.bgColor + "]"
    const borderString = "border-[#" + props.borderColor + "]"

    const classNameString = bgString + " " + borderString + " h-8 w-11/12 border-2 flex justify-center items-center"

    return (
        <div className={classNameString}>
            {Math.round(currAttTime / currTotalTime * 10000) / 100 + "%"}
        </div>
    )
}

export function VerticalPositioningDescBox(props: {text: string, bgColor: string}) {
    const bgString = "bg-[#" + props.bgColor + "]"

    const classNameString = bgString + " text-xs h-6 w-10/12 mt-1 border-2 flex justify-center items-center"

    return (
        <div className={classNameString}>{props.text}</div>
    )
}

export function TeamTitle(props: {name: string, players: string[], stroke: string}) {
    const parentDivClassName = "bg-[#" + secondaryBackgroundColor + "]" + " border-[#" + boxBorderColor + "]" + " w-1/6 h-48 align middle mb-3 mr-3 justify-center border-2"
    const childDivClassName = props.stroke + "-stroke-2 w-full h-4 flex justify-center text-xl mt-2 mb-4"

    return (
        <div className={parentDivClassName}>
            <div className={childDivClassName}>{props.name}</div>
            {
                props.players.map((player: any) => <div key={player.id.id} className="w-full h-6 flex justify-center text-sm">{player.name}</div>)
            }
        </div>
    )
}

let firstPlayerPresented = false

export function PlayerTitleBox(props: {name: string, isOrange: number}) {
    let parentDivClassNameString = ""
    {
        firstPlayerPresented === false ?
        parentDivClassNameString = "border-l-2 justify-center border-t-2 border-[#222222]" :
        parentDivClassNameString = "border-l-0 justify-center border-t-2 border-[#222222]"
    }

    return (
        <div className={parentDivClassNameString}>
            <div className="flex items-center justify-center h-8 flex-wrap truncate text-center"><strong>{props.name}</strong>
            {
                props.isOrange === 1 ?
                <NameUnderline bgColor={orangeTeamColor}/> :
                <NameUnderline bgColor={blueTeamColor}/>
            }
            </div>
            {firstPlayerPresented = true}
        </div>
    )
}

export default function StatisticalData({width = 1280, height = 720}: {width?: number, height?: number}) { // async
    const orangeScore = json.gameMetadata.score.team1Score
    const blueScore = json.gameMetadata.score.team0Score

    const duration = json.gameMetadata.length

    const playerList = json.players
    let orangeTeam: any[] = []
    let blueTeam: any[] = []

    playerList.forEach(
        (player: any) => 
            player.isOrange === 1 ?
            orangeTeam.push(player) :
            blueTeam.push(player)
    )

    const titleClassNameString = "bg-[#" + secondaryBackgroundColor + "]" + " border-[#" + boxBorderColor + "]" + " text-4xl w-4/6 h-12 flex flex-nowrap-36 items-center justify-center my-3 mb-3 ml-3 mr-3 border-2"
    const scoreClassNameString = "bg-[#" + secondaryBackgroundColor + "]" + " border-[#" + boxBorderColor + "]" + " w-4/6 h-48 flex align middle ml-3 mb-3 mr-3 border-2"
    const verticialPositioningParentDivClassName = "bg-[#" + secondaryBackgroundColor + "]" + " border-[#" + boxBorderColor + "]" + " flex w-full justify-center h-48 border-b-2"
    const gridSuperparentDivClassName = "bg-[#" + secondaryBackgroundColor + "]" + " mr-3 h-64 w-5/6"

    return (
        <div className="text-montserrat h-full bg-[#191919] justify-center">
            <div className="w-full flex items-center justify-center">
                <div className={titleClassNameString}>{json.gameMetadata.name}</div>
                <Button width="1/6" height="12" borderColor="ffffff" bgColor="18A0FB" text="3D View"/>
                <Button width="1/6" height="12" borderColor="18A0FB" bgColor="ffffff" text="Share"/>
            </div>
            <div className="w-full flex">
                <div className={scoreClassNameString}>
                    <div className="text-5xl w-2/6 flex flex-wrap items-center justify-center ">
                        {
                            blueScore > orangeScore ?
                            <Score leftScore={blueScore} rightScore={orangeScore} winner="blue"/> :
                            <Score leftScore={orangeScore} rightScore={blueScore} winner="orange"/>
                        }
                        <div className="text-xl w-full flex flex-wrap items-start justify-center h-1/2 mt-2">--RANK HERE--</div>
                    </div>
                    <VerticalSeparatorBar/>
                    <MetadataColumn titles={["Uploaded", "Played", "Uploader", "Arena"]} metadata={["--DATE HERE--", "--DATE HERE--", "--UPLOADER HERE--", json.gameMetadata.map]} />
                    <VerticalSeparatorBar/>
                    {
                        Math.floor(duration) % 60 < 10 ?
                        <MetadataColumn titles={["Duration", "Season", "Gamemode", "Gametype"]} metadata={[Math.floor(duration / 60) + ":0" + Math.floor(duration % 60), "--SEASON HERE--", "--GAMEMODE HERE--", json.gameMetadata.playlist]}/> :
                        <MetadataColumn titles={["Duration", "Season", "Gamemode", "Gametype"]} metadata={[Math.floor(duration / 60) + ":" + Math.floor(duration % 60), "--SEASON HERE--", "--GAMEMODE HERE--", json.gameMetadata.playlist]}/>
                    }
                </div>
                <TeamTitle name="Blue" stroke="blue" players={blueTeam}/>
                <TeamTitle name="Orange" stroke="orange" players={orangeTeam}/>
            </div>
            <div className="flex flex-nowrap">
                <div className="ml-3 w-1/6 bg-[#191919] mt-0.5">
                    <VariableBlock text="" height={8} bgColor="191919" topBorderWidth={0} leftBorderWidth={0} bottomBorderWidth={0}/>
                    <VariableBlock text="Score" height={8} bgColor={secondaryBackgroundColor} topBorderWidth={2} leftBorderWidth={2} bottomBorderWidth={0}/>
                    <VariableBlock text="Goals" height={8} bgColor={primaryBackgroundColor} topBorderWidth={0} leftBorderWidth={2} bottomBorderWidth={0}/>
                    <VariableBlock text="Assists" height={8} bgColor={secondaryBackgroundColor} topBorderWidth={0} leftBorderWidth={2} bottomBorderWidth={0}/>
                    <VariableBlock text="Saves" height={8} bgColor={primaryBackgroundColor} topBorderWidth={0} leftBorderWidth={2} bottomBorderWidth={0}/>
                    <VariableBlock text="Shots" height={8} bgColor={secondaryBackgroundColor} topBorderWidth={0} leftBorderWidth={2} bottomBorderWidth={0}/>
                    <VariableBlock text="Player of Match" height={8} bgColor={primaryBackgroundColor} topBorderWidth={0} leftBorderWidth={2} bottomBorderWidth={0}/>
                    <VariableBlock text="Vertical Positioning" height={48} bgColor={secondaryBackgroundColor} topBorderWidth={0} leftBorderWidth={2} bottomBorderWidth={2}/>
                </div>
                {firstPlayerPresented = false}
                <div className={gridSuperparentDivClassName}>
                    { 
                        <div className={`grid grid-cols-${playerList.length} border-r-2 border-[#222222]`}>
                            {
                                playerList.map((player: any) =>
                                    <div key={player.id.id}>
                                        {getVerticalData(player)}
                                        <PlayerTitleBox name={player.name} isOrange={player.isOrange}/>
                                        <DataBlock data={player.score} bgColor={secondaryBackgroundColor}/>
                                        <DataBlock data={player.goals} bgColor={primaryBackgroundColor}/>
                                        <DataBlock data={player.assists} bgColor={secondaryBackgroundColor}/>
                                        <DataBlock data={player.saves} bgColor={primaryBackgroundColor}/>
                                        <DataBlock data={player.shots} bgColor={secondaryBackgroundColor}/>
                                        {
                                            player.id.id === json.gameMetadata.primaryPlayer.id ?
                                            <DataBlock data="YES" bgColor={primaryBackgroundColor}/> :
                                            <DataBlock data="-" bgColor={primaryBackgroundColor}/>
                                        }
                                        <div className={verticialPositioningParentDivClassName}>
                                            <div className="flex flex-wrap w-full items-center justify-center">
                                                <VerticalPositioningDescBox text="Offense" bgColor={primaryBackgroundColor}/>
                                                <VerticalPositioningDataBox numerator={currAttTime} denominator={currTotalTime} bgColor={primaryBackgroundColor} borderColor="ffffff"/>
                                                <VerticalPositioningDataBox numerator={currNeuTime} denominator={currTotalTime} bgColor={primaryBackgroundColor} borderColor="ffffff"/>
                                                <VerticalPositioningDataBox numerator={currDefTime} denominator={currTotalTime} bgColor={primaryBackgroundColor} borderColor="ffffff"/>
                                                <VerticalPositioningDescBox text="Defense" bgColor={primaryBackgroundColor}/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
            <div className="bg-[#191919] h-3"></div>
        </div>
   )
}