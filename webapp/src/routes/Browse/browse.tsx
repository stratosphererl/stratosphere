import { useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import MainPane from "../../components/general/MainPane/mainPane"
import DataComponent from "../../components/replays/data"
import ErrorPage from "../Error/error"
import ReplayJSONs from "../../mock/uploaded_replays.json" // "../../mock/replays.json"
import "./browse.css"

import { SearchContext, ArenaContext, DurationContext, GamemodeContext, GametypeContext, RankContext, SeasonContext } from "../../context/contexts"

export default function Browse() {
    const params = useParams();

    if (params.version != "0" && params.version != "1") {
        return <ErrorPage message = "Version parameter must be 0 or 1"/>;
    }

    const replayArray = ReplayJSONs.data

    // Setting up search feature with state
    const [replaysAfterFiltering, setReplaysAfterFiltering] = useState(replayArray);

    const searchContext = useContext(SearchContext)
    const setSearchTerm = (event: any) => { searchContext.reviseSearch(event.target.value) }

    const arenaContext = useContext(ArenaContext)
    const setArenaTerm = (event: any) => { arenaContext.reviseArena(event.target.value) }

    useEffect(() => {
        let filteredArray = replayArray

        console.log(searchContext.search)
        console.log(arenaContext.arena)

        filteredArray = filteredArray.filter((replay: any) =>
            (replay.name.toLowerCase()).includes(searchContext.search.toLowerCase())
        )

        if (arenaContext.arena !== "ANY") {
            filteredArray = filteredArray.filter((replay: any) =>
                (replay.map.base_name).includes(arenaContext.arena)
            )
        }

        setReplaysAfterFiltering(filteredArray)
        
    }, [searchContext, arenaContext]);

    // const searchFiltering = () => {
    //     console.log(searchTerm)
    //     console.log(arenaTerm)

    //     let filteredArray = replayArray

    //     filteredArray = filteredArray.filter((replay: any) =>
    //         (replay.name.toLowerCase()).includes(searchTerm.toLowerCase())
    //     )

    //     filteredArray = filteredArray.filter((replay:any) =>
    //         (replay.map.base_name).includes(arenaTerm)
    //     )

    //     setReplaysAfterFiltering(filteredArray)
    // }

    // const searchFiltering = (event: any) => {
    //     let arrayAfterFilter = replaysAfterFiltering

    //     arrayAfterFilter = replaysAfterFiltering.filter((replay: any) =>
    //         (replay.name.toLowerCase()).includes(event.target.value.toLowerCase())
    //     )
        
    //     setReplaysAfterFiltering(arrayAfterFilter)
    // }

    // const arenaFiltering = (event: any) => {
    //     let arrayAfterFilter = replaysAfterFiltering

    //     arrayAfterFilter = 
    // }

    function FilterDropdown(props: {text: string}) {
        let optionArray = []
        let contextValue = null
        let contextMethod = (input: string) => {}
    
        if (props.text === "ARENA") {
            optionArray = getArenaArray()
            contextValue = useContext(ArenaContext).arena
            contextMethod = useContext(ArenaContext).reviseArena
        } else if (props.text === "DURATION") {
            optionArray = getDurationArray()
            contextValue = useContext(DurationContext).duration
            contextMethod = useContext(DurationContext).reviseDuration
        } else if (props.text === "GAMEMODE") {
            optionArray = getGamemodeArray()
            contextValue = useContext(GamemodeContext).gamemode
            contextMethod = useContext(GamemodeContext).reviseGamemode
        } else if (props.text === "GAMETYPE") {
            optionArray = getGametypeArray()
            contextValue = useContext(GametypeContext).gametype
            contextMethod = useContext(GametypeContext).reviseGametype
        } else if (props.text === "RANK") {
            optionArray = getRankArray()
            contextValue = useContext(RankContext).rank
            contextMethod = useContext(RankContext).reviseRank
        } else if (props.text === "SEASON") {
            optionArray = getSeasonArray()
            contextValue = useContext(SeasonContext).season
            contextMethod = useContext(SeasonContext).reviseSeason
        } else {
            return (<div>ABC</div>) // Add throw error here
        }
    
        function handleChange(event: any) {
            if (props.text === "ARENA") {
                setArenaTerm(event)
            }
        }
    
        return (
            <div className="filter-dropdown glass-inner rounded-full flex justify-center items-center">
                <div className="glass-inner-light rounded-full w-[94%] m-2 h-[70%] flex justify-center items-center">
                    <select name={props.text} id={props.text} className="rounded-full w-[92%]" onChange={handleChange}>
                        <option value="ANY" className="option-text">ANY {props.text}</option>
                        {
                            optionArray.map((optionValue) =>
                                <option value={optionValue} className="option-text">{optionValue}</option>
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
            {/* {useContext(ArenaContext).arena}
            {useContext(DurationContext).duration}
            {useContext(GamemodeContext).gamemode}
            {useContext(GametypeContext).gametype}
            {useContext(RankContext).rank}
            {useContext(SeasonContext).season} */}
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
                {
                    replaysAfterFiltering.map((replay, index) =>
                        <div>
                            <DataComponent data={replay} version={0} classname="rounded-lg"/>
                            {
                                index + 1 === replaysAfterFiltering.length ?
                                <div></div> :
                                <HorizontalSpacing/>
                            }
                        </div>
                    )
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

// export function FilterDropdown(props: {text: string}) {
//     let optionArray = []
//     let contextValue = null
//     let contextMethod = (input: string) => {}

//     if (props.text === "ARENA") {
//         optionArray = getArenaArray()
//         contextValue = useContext(ArenaContext).arena
//         contextMethod = useContext(ArenaContext).reviseArena
//     } else if (props.text === "DURATION") {
//         optionArray = getDurationArray()
//         contextValue = useContext(DurationContext).duration
//         contextMethod = useContext(DurationContext).reviseDuration
//     } else if (props.text === "GAMEMODE") {
//         optionArray = getGamemodeArray()
//         contextValue = useContext(GamemodeContext).gamemode
//         contextMethod = useContext(GamemodeContext).reviseGamemode
//     } else if (props.text === "GAMETYPE") {
//         optionArray = getGametypeArray()
//         contextValue = useContext(GametypeContext).gametype
//         contextMethod = useContext(GametypeContext).reviseGametype
//     } else if (props.text === "RANK") {
//         optionArray = getRankArray()
//         contextValue = useContext(RankContext).rank
//         contextMethod = useContext(RankContext).reviseRank
//     } else if (props.text === "SEASON") {
//         optionArray = getSeasonArray()
//         contextValue = useContext(SeasonContext).season
//         contextMethod = useContext(SeasonContext).reviseSeason
//     } else {
//         return (<div>ABC</div>) // Add throw error here
//     }

//     function handleChange(event: any) {
//         contextMethod(event.target.value)
//     }

//     return (
//         <div className="filter-dropdown glass-inner rounded-full flex justify-center items-center">
//             <div className="glass-inner-light rounded-full w-[94%] m-2 h-[70%] flex justify-center items-center">
//                 <select name={props.text} id={props.text} className="rounded-full w-[92%]" onChange={handleChange}>
//                     <option value="ANY" className="option-text">ANY {props.text}</option>
//                     {
//                         optionArray.map((optionValue) =>
//                             <option value={optionValue} className="option-text">{optionValue}</option>
//                         )
//                     }
//                 </select>
//             </div>
//         </div>
//     )
// }

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