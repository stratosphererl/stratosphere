import { useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import MainPane from "../../components/general/MainPane/mainPane"
import DataComponent from "../../components/replays/data"
import ErrorPage from "../Error/error"
import ReplayJSONs from "../../mock/uploaded_replays.json" // "../../mock/replays.json"
import "./browse.css"

import {
    SearchContext,
    ArenaContext,
    DurationContext,
    GamemodeContext,
    GametypeContext,
    RankContext,
    SeasonContext,
    QueryContext
} from "../../context/contexts"

export default function Browse() {
    const params = useParams();

    if (params.version != "0" && params.version != "1") {
        return <ErrorPage message = "Version parameter must be 0 or 1"/>;
    }

    const FILTER_OPTIONS_QUERY = gql`
        query GetOptions {
            getOptions {
            seasons
            ranks
            maps
            gameTypes
            gameModes
            }
        }      
    `

    function getOptions() {
        const { loading, error, data } = useQuery(FILTER_OPTIONS_QUERY)
        return data
    }

    const optionsList = getOptions()

    const arenaOptions = optionsList && optionsList.getOptions.maps
    const gamemodeOptions = optionsList && optionsList.getOptions.gameModes
    const gametypeOptions = optionsList && optionsList.getOptions.gameTypes
    const rankOptions = optionsList && optionsList.getOptions.ranks
    const seasonOptions = optionsList && optionsList.getOptions.seasons

    const replayArray = ReplayJSONs.data

    // Setting up search feature with state
    const [replaysAfterFiltering, setReplaysAfterFiltering] = useState(replayArray);

    const searchContext = useContext(SearchContext)
    const setSearchTerm = (event: any) => { searchContext.reviseSearch(event.target.value) }

    const arenaContext = useContext(ArenaContext)
    const setArenaTerm = (event: any) => { arenaContext.reviseArena(event.target.value) }

    const durationContext = useContext(DurationContext)
    const setDurationTerm = (event: any) => { durationContext.reviseDuration(event.target.value) }

    const gamemodeContext = useContext(GamemodeContext)
    const setGamemodeTerm = (event: any) => { gamemodeContext.reviseGamemode(event.target.value) }

    const gametypeContext = useContext(GametypeContext)
    const setGametypeTerm = (event: any) => { gametypeContext.reviseGametype(event.target.value) }

    const rankContext = useContext (RankContext)
    const setRankTerm = (event: any) => { rankContext.reviseRank(event.target.value) }

    const seasonContext = useContext(SeasonContext)
    const setSeasonTerm = (event: any) => { seasonContext.reviseSeason(event.target.value) }

    const queryContext = useContext(QueryContext)
    const setValueTerm = (event: any) => { 
        const value = event.target.value

        if (value.startsWith("ANY")) {
            queryContext.reviseValue("ANY")
        } else if (value.startsWith("0-2")) {
            queryContext.reviseValue("~lte~120")
        } else if (value.startsWith("2-4")) {
            queryContext.reviseValue("~gte~120&~lte~240")
        } else if (value.startsWith("4-6")) {
            queryContext.reviseValue("~gte~240&~lte~360")
        } else if (value.startsWith("6-8")) {
            queryContext.reviseValue("~gte~360&~lte~480")
        } else if (value.startsWith("8-10")) {
            queryContext.reviseValue("~gte~480&~lte~600")
        } else if (value.startsWith("10-12")) {
            queryContext.reviseValue("~gte~600&~lte~720")
        } else if (value.startsWith("12-14")) {
            queryContext.reviseValue("~gte~720&~lte~840")
        } else if (value.startsWith("14-16")) {
            queryContext.reviseValue("~gte~840&~lte~960")
        } else if (value.startsWith("16-18")) {
            queryContext.reviseValue("~gte~960&~lte~1080")
        } else if (value.startsWith("18-20")) {
            queryContext.reviseValue("~gte~1080&~lte~1200")
        } else {
            queryContext.reviseValue("~gte~1200")
        }

        console.log("Within setValueTerm: " + queryContext.value)
    }

    const SEARCH_REPLAYS_QUERY = gql`
        query Query($input: Search!) {
            searchReplays(input: $input) {
            data {
                gameMode
                gameType
                map {
                    name
                }
                id
                length
                name
                players {
                    name
                    is_orange
                    rank {
                        mmr
                        title
                    }
                }
                season {
                    name
                }
                uploadDate
                matchType
                ranked
                teams {
                    score
                    isOrange
                }
                time
            }
            page
            total
            }
        }
    `

    let SEARCH_REPLAYS_INPUT = {
        "input": {
            "name": searchContext.search,
            "map": arenaContext.arena === "ANY" ? null : arenaContext.arena,
            "duration": queryContext.value === "ANY" ? null : queryContext.value,
            "gameMode": gamemodeContext.gamemode === "ANY" ? null : gamemodeContext.gamemode,
            "gameType": gametypeContext.gametype === "ANY" ? null : gametypeContext.gametype,
            "rank": rankContext.rank === "ANY" ? null : rankContext.rank,
            "season": seasonContext.season === "ANY" ? null : seasonContext.season
        }
    }

    useEffect(() => {
        console.log("Within useEffect: " + queryContext.value)

        SEARCH_REPLAYS_INPUT = {
            "input": {
                "name": searchContext.search,
                "map": arenaContext.arena,
                "duration": queryContext.value,
                "gameMode": gamemodeContext.gamemode,
                "gameType": gametypeContext.gametype,
                "rank": rankContext.rank,
                "season": seasonContext.season
            }
        }
    }, [searchContext, arenaContext, gamemodeContext, gametypeContext, rankContext, seasonContext, queryContext]);

    const { loading, error, data } = useQuery(SEARCH_REPLAYS_QUERY, {variables: SEARCH_REPLAYS_INPUT})

    let replayList = data && data.searchReplays.data;

    function FilterDropdown(props: {text: string}) {
        let optionArray = []
        let visibleFilterValue = null
        let stateMethod: Function
    
        if (props.text === "ARENA") {
            if (arenaOptions) { optionArray = arenaOptions }
            visibleFilterValue = useContext(ArenaContext).arena
        } else if (props.text === "DURATION") {
            optionArray = getDurationArray()
            visibleFilterValue = useContext(DurationContext).duration
        } else if (props.text === "GAMEMODE") {
            if (gamemodeOptions) { optionArray = gamemodeOptions }
            visibleFilterValue = useContext(GamemodeContext).gamemode
        } else if (props.text === "GAMETYPE") {
            if (gametypeOptions) { optionArray = gametypeOptions }
            visibleFilterValue = useContext(GametypeContext).gametype
        } else if (props.text === "RANK") {
            if (rankOptions) { optionArray = rankOptions }
            visibleFilterValue = useContext(RankContext).rank
        } else if (props.text === "SEASON") {
            if (seasonOptions) { optionArray = seasonOptions }
            visibleFilterValue = useContext(SeasonContext).season
        } else {
            return (<div>ABC</div>) // Add throw error here
        }
    
        function handleChange(event: any) {
            if (props.text === "ARENA") {
                setArenaTerm(event)
            } else if (props.text === "DURATION") {
                setDurationTerm(event)
                setValueTerm(event)
            } else if (props.text === "GAMEMODE") {
                setGamemodeTerm(event)
            } else if (props.text === "GAMETYPE") {
                setGametypeTerm(event)
            } else if (props.text === "RANK") {
                setRankTerm(event)
            } else if (props.text === "SEASON") {
                setSeasonTerm(event)
            }
        }
    
        return (
            <div className="filter-dropdown glass-inner rounded-full flex justify-center items-center">
                <div className="glass-inner-light rounded-full w-[94%] m-2 h-[70%] flex justify-center items-center">
                    <select name={props.text} id={props.text} defaultValue={visibleFilterValue} className="rounded-full w-[92%]" onChange={handleChange}>
                        <option value="ANY" className="option-text">ANY {props.text}</option>
                        {
                            optionArray.map((optionValue) =>
                                <option key={optionValue} value={optionValue} className="option-text">{optionValue}</option>
                            )
                        }
                    </select>
                </div>
            </div>
        )
    }

    // TODO: Implement filtering out of replays NOT uploaded by a user when on browse/1

    return (
        <MainPane title="Browse Replays" className="w-[96%]">
            <div className="glass-inner rounded-full h-[48px] flex justify-center items-center mb-3">
                <input onChange={setSearchTerm} type="search" className="glass-inner-light rounded-full w-full m-2 h-[70%] flex justify-center items-center p-3" placeholder="SEARCH..." />
            </div>
            <div className="flex flex-nowrap justify-center">
                <FilterDropdown text="ARENA"/>
                <FilterDropdown text="DURATION"/>
                <FilterDropdown text="GAMEMODE"/>
                <FilterDropdown text="GAMETYPE"/>
                <FilterDropdown text="RANK"/>
                <FilterDropdown text="SEASON"/>
            </div>
            <div className="glass-inner round p-2">
                {   replayList ?
                    replayList.map((replay, index) =>
                        <div key={index}>
                            <DataComponent data={replay} version={0} classname="rounded-lg"/>
                            {
                                index + 1 === replaysAfterFiltering.length ?
                                <div></div> :
                                <HorizontalSpacing/>
                            }
                        </div>
                    ) :
                    <div></div>
                }
            </div>
        </MainPane>
    );
}

export function HorizontalSpacing() {
    return (
        <div style={{height: "0.5rem"}}/>
    )
}

function getArenaArray() {
    const arenaArray = [
        "DFH Stadium", "Mannfield", "Champions Field", "Urban Central", "Beckwith Park", "Utopia Coliseum", "Wasteland",
        "Neo Tokyo", "AquaDome", "Starbase Arc", "Salty Shores", "Farmstead", "Forbidden Temple", "Neon Fields",
        "Deadeye Canyon", "Sovereign Heights", "Rivals Arena", "Badlands", "Tokyo Underpass", "ARCTagon", "Throwback Stadium",
        "Pillars", "Cosmic", "Double Goal", "Underpass", "Utopia Retro", "Octagon", "Dunk House", "The Block", "Core 707"
    ]

    return arenaArray.sort((a, b) => a.localeCompare(b))
}

function getDurationArray() {
    const durationArray = [
        "0-2 minutes", "2-4 minutes", "4-6 minutes", "6-8 minutes", "8-10 minutes", 
        "10-12 minutes", "12-14 minutes", "14-16 minutes", "18-20 minutes", "20+ minutes"
    ]

    return durationArray
}

function getGamemodeArray() {
    const gamemodeArray = [
        "Soccar", "Hoops", "Rumble", "Dropshot", "Snowday", "Rocket Labs", "Dropshot Rumble",
        "Heatseeker", "Gridiron", "Private", "Season", "Offline", "Local Lobby"
    ]

    return gamemodeArray.sort((a, b) => a.localeCompare(b))
}

function getGametypeArray() {
    const gametypeArray = [
        "Duels (1v1)", "Doubles (2v2)", "Standard (3v3)", "Solo Standard (3v3)", "Chaos (4v4)"
    ]

    return gametypeArray
}

function getRankArray() {
    const rankArray = [
        "Unranked",
        "Bronze I", "Bronze II", "Bronze III",
        "Silver I", "Silver II", "Silver III",
        "Gold I", "Gold II", "Gold III",
        "Platinum I", "Platinum II", "Platinum III",
        "Diamond I", "Diamond II", "Diamond III",
        "Champion I", "Champion II", "Champion III",
        "Grand Champion I", "Grand Champion II", "Grand Champion III",
        "Supersonic Legend"
    ]

    return rankArray
}

function getSeasonArray() {
    const seasonArray = [
        "Legacy 1", "Legacy 2", "Legacy 3", "Legacy 4", "Legacy 5", "Legacy 6", "Legacy 7",
        "Legacy 8", "Legacy 9", "Legacy 10", "Legacy 11", "Legacy 12", "Legacy 13", "Legacy 14",
        "Free-to-Play 1", "Free-to-Play 2", "Free-to-Play 3", "Free-to-Play 4", "Free-to-Play 5",
        "Free-to-Play 6", "Free-to-Play 7", "Free-to-Play 8", "Free-to-Play 9", "Free-to-Play 10"
    ]

    return seasonArray
}