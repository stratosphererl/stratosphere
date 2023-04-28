import "../../index.css"
import "./data.css"

export default function ReplayData(props: {data: JSON, version: number, classname: string}) {

    // Replay title variables
    const replayTitle = props.data.name

    // Replay score variables
    const blueScore = props.data.score.team0Score
    const orangeScore = props.data.score.team1Score

    // Replay variables for first column
    const replayID = props.data.id
    const uploadDate = (new Date(props.data.uploadDate)).toUTCString().substring(5,22)
    const playingDate = (new Date(props.data.time * 1000)).toUTCString().substring(5,22)
    const uploaderUsername = "--PLACEHOLDER--"
    const mapName = props.data.map.base_name

    // Replay variables for second column
    // const avgRank = Math.round(getAverageRank(props.data.ranks)) // WAITING
    const duration = convertToTimeString(props.data.length)
    const season = props.data.season.name.replace("Season","")
    const gamemode = "--PLACEHOLDER--"
    const gametype = props.data.playlist

    // Replay players

    // Waiting on Chris to get player info into replay headers
    // const [blueName, orangeName, bluePlayers, orangePlayers] = getPlayers(props.data.players) TODO:
    
    return (
        // version == 1 used for calls from replay.tsx
        // version == 0 used for calls from browse.tsx

        <div className={`glass-inner round flex flex-wrap justify-center replay-data-mobile ${props.classname}`}>
            <div className="glass-inner mx-2 flex mt-2 title-box"><b><i>{replayTitle}</i></b></div>
            <div className="score-column flex justify-center">
            { blueScore > orangeScore ?
                <div className="sky-blue-stroke-2"><b>{blueScore} - {orangeScore}</b></div> :
                <div className="orange-stroke-2"><b>{orangeScore} - {blueScore}</b></div>
            }
            </div>
            <VerticalSeparator/>
            <InfoColumn subtitles={["Uploaded","Played","Uploader","Arena"]} info={[uploadDate,playingDate,uploaderUsername,mapName]} titleInfo="small-title">
                <div><b>{replayID}</b></div>
            </InfoColumn>
            <VerticalSeparator/>
            <InfoColumn subtitles={["Duration","Season","Gamemode","Gametype"]} info={[duration,season,gamemode,gametype]} titleInfo="">
                {/* <div><b>{avgRank}</b></div> */}
                <div><b>AVG RANK MOCK</b></div>
            </InfoColumn>
            <VerticalSeparator/>
            {/* <TeamColumn name={blueName} teamTextStyle="sky-blue-stroke-1" playerNames={bluePlayers}/> */} 
            <TeamColumn name="BLUE" teamTextStyle="sky-blue-stroke-1" playerNames={[]}/>
            <VerticalSeparator/>
            {/* <TeamColumn name={orangeName} teamTextStyle="orange-stroke-1" playerNames={orangePlayers}/> */}
            <TeamColumn name="ORANGE" teamTextStyle="orange-stroke-1" playerNames={[]}/>
            <VerticalSeparator/>
            <ButtonColumn version={props.version} replayID={replayID}/>
        </div>
    );
}

export function InfoColumn(props: {subtitles: string[], info: string[], children: JSX.Element, titleInfo: string}) {
    const fullWidthCentered = "w-full flex justify-center"
    return (
        <div className="info-column flex flex-wrap justify-center">
            <div className={`${fullWidthCentered} title truncation ${props.titleInfo}`}><b>{props.children}</b></div>
            <div className={fullWidthCentered}><b><u>{props.subtitles[0]}</u></b>: {props.info[0]}</div>
            <div className={fullWidthCentered}><b><u>{props.subtitles[1]}</u></b>: {props.info[1]}</div>
            <div className={fullWidthCentered}><b><u>{props.subtitles[2]}</u></b>: {props.info[2]}</div>
            <div className={fullWidthCentered}><b><u>{props.subtitles[3]}</u></b>: {props.info[3]}</div>
        </div>
    )
}

export function TeamColumn(props: {name: string, teamTextStyle: string, playerNames: string[]}) {
    const fullWidthCentered = "w-full flex justify-center"
    
    return (
        <div className="team-column flex flex-wrap justify-center">
            <div className={`${fullWidthCentered} ${props.teamTextStyle} title truncate`}><b>{props.name}</b></div>

            {
                props.playerNames.map((playerName) =>
                    playerName !== "" ?
                    <div className={`${fullWidthCentered}`}>{playerName}</div> :
                    <div className={`${fullWidthCentered}`}>&nbsp;</div>
                )
            }
        </div>
    )
}

export function ButtonColumn(props: {version: number, replayID: string}) {
    if (props.version === 0) {
        return (
            <div className="button-column flex flex-wrap">
                <a className="data-inverted-primary-btn top-btn flex justify-center"
                    href={`/replay/${props.replayID}`}>Full Data</a>
                <a className="data-primary-btn mid-btn"
                    onClick={() => console.log("2D View button clicked!")}>2D View</a>
                <a className="data-primary-btn bot-btn"
                    onClick={() => toClipboardWithAlert(props.replayID)}>Share</a>
            </div>
        )
    } else {
        return (
            <div className="button-column flex flex-wrap">
                <a className="data-inverted-primary-btn top-btn flex justify-center"
                    onClick={() => console.log("Download button clicked!")}>Download</a>
                <a className="data-primary-btn mid-btn"
                    onClick={() => console.log("2D View button clicked!")}>2D View</a>
                <a className="data-primary-btn bot-btn"
                    onClick={() => toClipboardWithAlert(props.replayID)}>Share</a>
            </div>
        )
    }
}

export function VerticalSeparator() {
    return (
        <div className="flex items-center">
            <div className="separator">&nbsp;</div>
        </div>
    )
}

function toClipboardWithAlert(replayID: string) {
    navigator.clipboard.writeText(`http://127.0.0.1:5173/replay/${replayID}`)
    alert("Link to this replay has been copied to the clipboard!")
    console.log("Replay link copied to the clipboard")
    return
}

function convertToTimeString(seconds: number) {
    const mins = "" + Math.floor(seconds / 60)
    const secs = "" + Math.floor(seconds % 60)

    if (secs.length > 1) {
        return mins + ":" + secs
    } else {
        return mins + ":0" + secs
    }
}

function getAverageRank(rankings: JSON[]) {
    let sum = 0
    let players = 0

    rankings.map((info) => sum = sum + info.pre_mmr)
    rankings.map((info) => players = players + 1)

    return sum / players
}

function getPlayers(players: JSON[]) {
    let returnList = []

    let bluePlayers = []
    let orangePlayers = []

    players.map((info) =>
        info.isOrange === 0 ?
        bluePlayers.push(info.name) :
        orangePlayers.push(info.name)
    )
    
    bluePlayers = reformatPlayerList(bluePlayers)
    orangePlayers = reformatPlayerList(orangePlayers)
    
    return(["BLUE","ORANGE",bluePlayers,orangePlayers])
}

function reformatPlayerList(playerList: string[]) {
    if (playerList.length < 4) {
        while (playerList.length < 4) {
            playerList.push("")
        }
    } else if (playerList.length > 4) {
        playerList = playerList.slice(0,3)
        playerList.push("...")
    }

    return playerList
}