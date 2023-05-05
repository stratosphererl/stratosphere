import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useContext } from "react"
import { UserContext } from "../../context/contexts"
import MainPane from "../../components/general/MainPane/mainPane"
import "./statistics.css"
import PieChart from "../../components/visualizations/pie"
import PlayerBarGraph from "../../components/visualizations/stacked"

export default function Statistics() {
    const params = useParams();

    // TODO: Remove mock user id, use real id
    const userValue = useContext(UserContext).user
    const currUserId = userValue.id

    const numUsers = getData(
        gql`query Query { users { id } }`, {}, "numUsers"
    )

    // const NUM_USERS_QUERY = gql`query Query { users { id } }`
    


    const PLATFORM_QUERY = gql`query Query { getPlatformCount { platforms { count platform } } }`
    const { loading, error, data } = useQuery(PLATFORM_QUERY)

    const platformData = data && data.getPlatformCount[0].platforms

    let steamPlayers = null
    let epicPlayers = null
    let xboxPlayers = null
    let psnPlayers = null
    let pieChartData = null

    if (platformData) {
        for (let i = 0; i < platformData.length; i++) {
            const currPlatform = platformData[i].platform
            if (currPlatform === "steam") {
                steamPlayers = platformData[i].count
            } else if (currPlatform === "epic") {
                epicPlayers = platformData[i].count
            } else if (currPlatform === "xbox") {
                xboxPlayers = platformData[i].count
            } else if (currPlatform === "playstation") {
                psnPlayers = platformData[i].count
            }
        }
    

        pieChartData = [
            {
                name: "Steam",
                value: steamPlayers,
                color: "#202742"
            },
            {
                name: "Epic",
                value: epicPlayers,
                color: "#2B292A"
            },
            {
                name: "Xbox",
                value: xboxPlayers,
                color: "#107C10"
            },
            {
                name: "PSN",
                value: psnPlayers,
                color: "#006FCD"
            }
        ]
    }
    

    const replaysDataString = getData(
        gql`query Query($userId: Int!) { user(id: $userId) { wins losses number_of_replays } }`, {userId: currUserId}, "replays"
    )

    const goalsDataString = getData(
        gql`query Query($userId: Int!) { user(id: $userId) { total_goals number_of_replays } }`, {userId: currUserId}, "goals"
    )

    const assistsDataString = getData(
        gql`query Query($userId: Int!) { user(id: $userId) { total_assists number_of_replays } }`, {userId: currUserId}, "assists"
    )

    const savesDataString = getData(
        gql`query Query($userId: Int!) { user(id: $userId) { total_saves number_of_replays } }`, {userId: currUserId}, "saves"
    )

    const shotsDataString = getData(
        gql`query Query($userId: Int!) { user(id: $userId) { total_shots number_of_replays } }`, {userId: currUserId}, "shots"
    )

    if (params.version != "0" && params.version != "1") {
        throw new Error("Version parameter must be 0 or 1");
    }

    console.log(pieChartData)
    if (params.version === "0" && pieChartData) {
        return (
            <MainPane title="Population Stats" className="statistics">
                <div className="glass-inner round data-pane flex flex-nowrap justify-center items-center">
                    <div className="title-column"><b><i>UNIQUE PLAYERS</i></b></div>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="STRATOSPHERE" data={numUsers} class={1}/>
                    <VerticalBar rightMargin={false}/>
                    <PieChart className="w-1/12 p-2" data={pieChartData} disableOpacity={true}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="STEAM" data={steamPlayers} class={2}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="EPIC" data={epicPlayers} class={2}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="XBOX" data={xboxPlayers} class={2}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="PSN" data={psnPlayers} class={2}/>
                    <VerticalBar rightMargin={true}/>
                </div>
                <GraphPane paneTitle="REPLAY DURATIONS"/>
                <GraphPane paneTitle="REPLAY RANKS"/>
                <GraphPane paneTitle="REPLAY SEASONS"/>
            </MainPane>
        );
    } else {
        return (
            <MainPane title="Individual Stats" className="statistics">
                <div className="glass-inner round data-pane flex flex-nowrap justify-center items-center">
                    <div className="title-column"><b><i>GAMEPLAY STATS</i></b></div>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="REPLAYS" data={replaysDataString} class={3}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="GOALS" data={goalsDataString} class={3}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="ASSISTS" data={assistsDataString} class={3}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="SAVES" data={savesDataString} class={3}/>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="SHOTS" data={shotsDataString} class={3}/>
                    <VerticalBar rightMargin={true}/>
                </div>
                <GraphPane paneTitle="REPLAY DURATIONS"/>
                <GraphPane paneTitle="REPLAY RANKS"/>
                <GraphPane paneTitle="REPLAY SEASONS"/>
            </MainPane>
        )
    }
}

// const data = [
//     {
//       season: "Season 1",
//       count: 24
//     },
//     {
//       season: "Season 2",
//       count: 13
//     }
//   ]
  
//   const group_label = "season"
//   const sub_groups = ["count"]


// const { loading, error, data } useQuery(REPLAY_DURATIONS_QUERY)

export function GraphPane(props: {paneTitle: string}) {
    const REPLAY_DURATIONS_QUERY = gql`
        query Query {
            getDurationCount {
                durations {
                    count
                    duration
                }
            }
        }
    `

    const { loading, error, data } = useQuery(REPLAY_DURATIONS_QUERY)

    if (loading) {
        console.log(loading)
        return null
    } else if (error) {
        console.log(error)
        return null
    } else {
        const graphData = data && data.getDurationCount[0].durations
        const groupLabel = data && "duration"
        const subGroups = data && ["count"]

        // for (let i = 0; i < graphData.length; i++) {
        //     graphData[i].duration = graphData[i].duration + " sec"
        // }

        console.log(graphData)

        return (
            <div className="glass-inner round data-pane flex flex-nowrap justify-center items-center">
                <div className="title-column"><b><i>{props.paneTitle}</i></b></div>
                <VerticalBar rightMargin={false}/>

                {/* <div className="graph-column">--GRAPH PLACEHOLDER--</div> */}
                <div className="pl-2 pt-2 pb-2 pr-1" style={{width: "480px"}}>
                    <PlayerBarGraph data={graphData} group_label={groupLabel} sub_groups={subGroups} svg_width={1300}/>
                </div>

                <VerticalBar rightMargin={true}/>
            </div>
        )
    }
}

export function DataColumn(props: {title: string, data: number, class: number}) {
    let dataColumnClassname = ""

    if (props.class === 1) {
        dataColumnClassname = "primary-data-column"
    } else if (props.class === 2) {
        dataColumnClassname = "secondary-data-column"
    } else if (props.class === 3) {
        dataColumnClassname = "text-data-column"
    } else {
        
    }

    return (
        <div className={`${dataColumnClassname} flex flex-wrap`} style={{backgroundImage: ""}}>
            <div className="data-column-title"><b>{props.title}</b></div>
            <div className="data-column-data">{props.data}</div>
        </div>
    )
}

export function VerticalBar(props: {rightMargin: boolean}) {
    let classname = ""

    if (props.rightMargin === false) {
        classname = "vertical-bar"
    } else {
        classname = "vertical-bar mr-4"
    }

    return (
        <div className={classname}></div>
    )
}

function getNumUsers() {
    const QUERY = gql`
        query Query {
            usersCount {
                count
            }
        }
    `;
    
    const { loading, error, data } = useQuery(QUERY)

    if (loading || error) {
        if (loading) {
            // console.log(loading)
        }
        if (error) {
            // console.log(error)
        }
        return null
    } else {
        return data.usersCount.count
    }
}

function getReplayDataString() {
    const QUERY = gql`
        query Query($userId: Int!) {
            user(id: $userId) {
                wins
                losses
            }
        }
    `;

    const { loading, error, data } = useQuery(QUERY, {variables: {userId: 1}})
    
    if (loading || error) {
        if (loading) {
            // console.log(loading)
        }
        if (error) {
            // console.log(error)
        }
        return null
    } else {
        const numReplays = data.user.wins + data.user.losses

        const replayString = <div>{numReplays} total<br/>({data.user.wins} wins)</div>

        return replayString
    }
}

function getData(queryString, variables, stringType) {
    const QUERY = queryString;

    const { loading, error, data } = useQuery(QUERY, {variables: variables})
    
    if (loading || error) {
        if (loading) {
            // console.log(loading)
        }
        if (error) {
            // console.log(error)
        }
        return null
    } else {
        if (stringType === "numUsers") {
            return data.users.length
        }
        if (stringType === "replays") {
            return <div>{data.user.number_of_replays} total<br/>({data.user.wins} wins)</div>
        }
        if (stringType === "goals") {
            const goals = data.user.total_goals
            const matches = data.user.number_of_replays
            const average = Math.round(goals / matches * 100) / 100
            return <div>{goals} total<br/>({average} / gm)</div>
        }
        if (stringType === "assists") {
            const assists = data.user.total_assists
            const matches = data.user.number_of_replays
            const average = Math.round(assists / matches * 100) / 100
            return <div>{assists} total<br/>({average} / gm)</div>
        }
        if (stringType === "saves") {
            const saves = data.user.total_saves
            const matches = data.user.number_of_replays
            const average = Math.round(saves / matches * 100) / 100
            return <div>{saves} total<br/>({average} / gm)</div>
        }
        if (stringType === "shots") {
            const shots = data.user.total_shots
            const matches = data.user.number_of_replays
            const average = Math.round(shots / matches * 100) / 100
            return <div>{shots} total<br/>({average} / gm)</div>
        }
    }
}