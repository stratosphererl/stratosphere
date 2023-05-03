import "../../index.css"
import "./data.css"
import { gql, useQuery } from '@apollo/client';

export default function ReplayData(props: {data: JSON, version: number, classname: string}) {
    // Replay title variables
    const replayTitle = props.data.name

    // Replay score variables
    const blueScore = props.data.teams[0].score
    const orangeScore = props.data.teams[1].score

    // Replay variables for first column
    const replayID = props.data.id
    const uploadDate = (new Date(props.data.uploadDate * 1000)).toUTCString().substring(5,22)
    const playingDate = (new Date(props.data.time * 1000)).toUTCString().substring(5,22)
    const uploaderUsername = getRandomUploader() // Currently mocked
    const mapName = props.data.map.name

    // Replay variables for second column
    const avgRank = calculateAvgRank(props.data.players, props.data.gameType)
    const duration = convertToTimeString(props.data.length)
    const season = props.data.season.name.replace("Season","")
    const gamemode = props.data.gameMode
    const gametype = props.data.gameType

    // Replay players
    const [blueName, orangeName, bluePlayers, orangePlayers] = getPlayers(props.data.players)
    
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
                <div><b>{avgRank}</b></div>
            </InfoColumn>
            <VerticalSeparator/>
            <TeamColumn name={blueName} teamTextStyle="sky-blue-stroke-1" playerNames={bluePlayers}/> 
            <VerticalSeparator/>
            <TeamColumn name={orangeName} teamTextStyle="orange-stroke-1" playerNames={orangePlayers}/>
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
                    <div key={playerName} className={`${fullWidthCentered}`}>{playerName}</div> :
                    <div key={playerName} className={`${fullWidthCentered}`}>&nbsp;</div>
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

function getPlayers(players: JSON[]) {
    let returnList = []

    let bluePlayers = []
    let orangePlayers = []

    players.map((info) =>
        info.is_orange === false ?
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

function calculateAvgRank(playerList: Array<JSON>, playlist: string) {
    let aggregateMMR = 0.0
    let numRankedPlayers = 0

    {
        playerList.map((player) =>
            player.rank ?
                player.rank.mmr ?
                aggregateMMR += parseFloat(player.rank.mmr) :
                null :
                null
        )
        playerList.map((player) =>
            player.rank ?
                player.rank.mmr ?
                numRankedPlayers += 1 :
                null :
                null
        )
    }

    if (aggregateMMR != 0.0 || numRankedPlayers != 0) {
        aggregateMMR = Math.round(aggregateMMR / numRankedPlayers)
    } else {
        const rankImage = <img src={`../../src/assets/ranks/0.png`} style={{width: "24px"}} className="mr-2" />

        return (
            <div className="flex flex-nowrap">
                {rankImage}
                <div>UNRANKED</div>
            </div>
        )
    }

    const RANK_QUERY = gql`
        query Query($input: MMRFromPlaylistForm!) {
            getRankFromPlaylistAndMMR(input: $input) {
                name
            }
        }    
    `

    const QUERY_INPUT = {
        "input": {
            "mmr": aggregateMMR,
            "playlist": "Standard"
        },
    }

    const { loading, error, data } = useQuery(RANK_QUERY, { variables: QUERY_INPUT } )
    
    const ranknameLowercase = data && data.getRankFromPlaylistAndMMR.name
    const ranknameUppercase = data && data.getRankFromPlaylistAndMMR.name.toUpperCase()
    const rankImage = convertRanknameToImage(ranknameLowercase)

    return (
        <div className="flex flex-nowrap">
            {rankImage}
            <div>{ranknameUppercase}</div>
        </div>
    )
}

function getRandomUploader() {
    const uploaders = ["Novarchite","Chicken935","Oakerinos"]
    return uploaders[Math.floor(Math.random() * uploaders.length)];
}

function convertRanknameToImage(rankname: string) {
    const conversionJSON = {
        "Unranked": 0,
        "Bronze I": 1,
        "Bronze II": 2,
        "Bronze III": 3,
        "Silver I": 4,
        "Silver II": 5,
        "Silver III": 6,
        "Gold I": 7,
        "Gold II": 8,
        "Gold III": 9,
        "Platinum I": 10,
        "Platinum II": 11,
        "Platinum III": 12,
        "Diamond I": 13,
        "Diamond II": 14,
        "Diamond III": 15,
        "Champion I": 16,
        "Champion II": 17,
        "Champion III": 18,
        "Grand Champion I": 19,
        "Grand Champion II": 20,
        "Grand Champion III": 21,
        "Supersonic Legend": 22,
    }

    return <img src={`../../src/assets/ranks/${conversionJSON[rankname]}.png`} style={{width: "24px"}} className="mr-2" />
}