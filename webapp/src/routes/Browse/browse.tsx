import { useParams } from 'react-router-dom';
import { useState } from 'react';
import MainPane from "../../components/general/MainPane/mainPane"
import DataComponent from "../../components/replays/data"
import ErrorPage from "../Error/error"
import ReplayJSON from "../../mock/replay.json"
import ReplayJSONs from "../../mock/replays.json"
import "./browse.css"

export default function Browse() {
    const params = useParams();

    if (params.version != "0" && params.version != "1") {
        return <ErrorPage message = "Version parameter must be 0 or 1"/>;
    }

    const replayArray = ReplayJSONs.data

    // Setting up search feature with state
    const [replaysAfterFiltering, setReplaysAfterFiltering] = useState(replayArray);

    const searchFiltering = (event: any) => {
        if (event.target.value === "") {
            setReplaysAfterFiltering(replayArray)
        } else {
            setReplaysAfterFiltering(replayArray.filter((replay: any) =>
                (replay.gameMetadata.name.toLowerCase()).includes(event.target.value.toLowerCase())
            ))
        }
    }

    // TODO: Implement filtering out of replays NOT uploaded by a user when on browse/1

    return (
        <MainPane title="Browse Replays" className="w-[96%]">
            <div className="glass-inner rounded-full h-[48px] flex justify-center items-center mb-3">
                <input onChange={searchFiltering} type="search" className="glass-inner-light rounded-full w-full m-2 h-[70%] flex justify-center items-center p-3" placeholder="SEARCH..." />
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

export function FilterDropdown(props: {text: string}) {
    return (
        <div className="filter-dropdown glass-inner rounded-full flex justify-center items-center">
            <div className="glass-inner-light rounded-full w-[94%] m-2 h-[70%] flex justify-center items-center">{props.text}</div>
        </div>
    )
}