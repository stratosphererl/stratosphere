import { responsePathAsArray } from "graphql";
import { useEffect, useRef, useState } from "react"

// fetch('http://example.com/movies.json')
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// import replayArray from "./replays"
const replayArray = await fetch("http://localhost:5001/parse/replayList").then((response) => response.json())
const arenaArray = await fetch("http://localhost:5001/parse/all/arena").then((response) => response.json())
const rankArray = await fetch("http://localhost:5001/parse/all/ranking").then((response) => response.json())
const durationArray = await fetch("http://localhost:5001/parse/all/duration").then((response) => response.json())
const seasonArray = await fetch("http://localhost:5001/parse/all/season").then((response) => response.json())
const gamemodeArray = await fetch("http://localhost:5001/parse/all/gamemode").then((response) => response.json())
const gametypeArray = await fetch("http://localhost:5001/parse/all/gametype").then((response) => response.json())

export default function SearchReplays({width = 1280, height = 720}: {width?: number, height?: number}) {

    const ref = useRef<HTMLDivElement>(null);

    const [replaysAfterFiltering, setReplaysAfterFiltering] = useState(replayArray);

    const onChange = (event: any) => {
        if (event.target.value === "") {
            setReplaysAfterFiltering(replayArray)
        } else {
            setReplaysAfterFiltering(replayArray.filter((replays: any) => replays.title.includes(event.target.value)))
        }
    }

    return (
        <div className="montserrat">
            <div className="text-xl mb-2">
                Search all replays
            </div>

            <div className="flex flex-nowrap mb-2">
                <div className="h-10 w-full rounded-full bg-[#333333]">
                    <div className="ml-4 mr-4">
                        <input onChange={onChange} type="search" className="focus:outline-none h-10 w-full bg-transparent text-[#ffffff] text-left text-sm flex items-center bg-[#333333]" placeholder="SEARCH..." />
                    </div>
                </div>
                {/* <button type="button" className="w-2/12 bg-[#333333] flex-wrap text-sm ml-3 mr-3 border-2 align-middle border-[#ffffff] bg-[#18A0FB]">SEARCH</button> */}
            </div>

            <div className="flex flex-nowrap mb-2 justify-center items-center">
                <FilteringDropdown name="ARENAS" values={arenaArray} />
                <FilteringDropdown name="RANKS" values={rankArray} />
                <FilteringDropdown name="DURATIONS" values={durationArray }/>
                <FilteringDropdown name="SEASONS" values={seasonArray}/>
                <FilteringDropdown name="GAMEMODES" values={gamemodeArray}/>
                <FilteringDropdown name="GAMETYPES" values={gametypeArray}/>
            </div>

            <div className="text-xl mb-2">
                <div className="">
                    Search results
                </div>
            </div>

            {/* {props.data.blue.players.slice(0,4).map((player: any) => <div className=
            "h-4 w-full text-sm flex align-middle justify-center">{player}</div>)} */}

            {replaysAfterFiltering.map((replayData: any) => <Replay data={replayData}/>)}

        </div>
    )

}

export function FilteringDropdown(props: {name: string, values: Array<string>}) {
    let num = -1;
    return (
        <div className="h-10 w-1/6 mr-2 rounded-full bg-[#333333] flex flex-wrap justify-center items-center">
            <form>
                <select name="arenas" id="arenas" className="bg-[#333333] w-44">
                    <option value="0" selected>ALL {props.name}</option>
                    {props.values.map((name: any) => <option value={num++}>{name}</option>)}
                </select>
            </form>
        </div>
    )
}

export function VerticalSeparatorBar() {
    return (
        <div className="h-32 w-0.5 flex align-middle justify-center mt-2 bg-[#18A0FB]"></div>
    )
}

export function HorizontalSeparatorBar() {
    return (
        <div className="h-0.5 mt-4 mb-4 bg-[#18A0FB]"></div>
    )
}

export function PageButtons() {
    return (
        <div className="flex justify-center align-middle mt-4">
            <button type="button" className="w-32 h-8 flex-wrap text-sm border-2 align-middle border-[#ffffff] bg-[#18A0FB] mr-2">Previous Page</button>
            <div className="w-1/12 h-8 flex align-middle justify-center bg-[#333333]">
                <div className="mt-1">1 / 9999</div>
            </div>
            <button type="button" className="w-32 h-8 flex-wrap text-sm border-2 align-middle border-[#ffffff] bg-[#18A0FB] ml-2">Next Page</button>
        </div>
    )
}

type ReplayData = {
    title: string;
    uploaded: {
        date: string,
        time: string,
    }
    played: {
        date: string,
        time: string,
    }
    uploader: string;
    arena: string;
    rank: string;
    duration: string;
    overtime: string,
    season: string;
    gamemode: string;
    gametype: string;
    blue: {
        name: string;
        score: number;
        players: Array<string>;
    }
    orange: {
        name: string;
        score: number;
        players: Array<string>;
    }
    winner: number;
    last: boolean;
};

export function Replay(props: {data: ReplayData}) {
    return (
        <div className="mb-2">
            <div className="flex flex-nowrap-36 bg-[#333333]">
                <div className="h-32 w-44 mt-2 mb-2 ml-2 mr-2 flex items-center justify-center">

                    {props.data.blue.score > props.data.orange.score ?
                        <div className="text-5xl ml-2 mr-2 blue-stroke-2"><strong>{props.data.blue.score} - {props.data.orange.score}</strong></div> :
                        <div className="text-5xl ml-2 mr-2 orange-stroke-2"><strong>{props.data.orange.score} - {props.data.blue.score}</strong></div>
                    }
                    
                </div>
                
                <VerticalSeparatorBar />

                <div className="h-32 w-96 mt-2 mb-2 ml-2 mr-2 flex flex-wrap justify-center">
                    <div className="h-6 w-full text-xl flex flex-wrap justify-center">
                        <strong>{props.data.title.length > 26 ? <div>{props.data.title.substring(0,23) + "..."}</div> : <div>{props.data.title}</div>}</strong>
                    </div>
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Uploaded</u></strong>: {props.data.uploaded.date} ({props.data.uploaded.time} GMT)</div>
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Played</u></strong>: {props.data.played.date} ({props.data.played.time} GMT)</div>
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Uploader</u></strong>: {props.data.uploader}</div>
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Arena</u></strong>: {props.data.arena}</div>
                </div>
                
                <VerticalSeparatorBar />

                <div className="h-32 w-72 mt-2 mb-2 ml-2 mr-2 flex flex-wrap">
                    <div className="h-6 w-full text-xl flex align-middle justify-center"><strong>{props.data.rank}</strong></div>
                    { props.data.overtime != "0:00" ?
                        <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Duration</u></strong>: {props.data.duration} ({props.data.overtime} OT)</div> :
                        <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Duration</u></strong>: {props.data.duration} (no OT)</div>
                    }
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Season</u></strong>: {props.data.season}</div>
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Gamemode</u></strong>: {props.data.gamemode}</div>
                    <div className="h-4 w-full text-sm flex align-middle justify-center"><strong><u>Gametype</u></strong>: {props.data.gametype}</div>
                </div>
                
                <VerticalSeparatorBar />

                <div className="h-32 w-36 mt-2 mb-2 ml-2 mr-2 flex flex-wrap bg-[#333333]">
                    <div className="h-6 w-full text-xl flex align-middle justify-center blue-stroke">
                        <strong>{props.data.blue.name.length > 12 ? <div>{props.data.blue.name.substring(0,9) + "..."}</div> : <div>{props.data.blue.name}</div>}</strong>
                    </div>
                    {props.data.blue.players.slice(0,4).map((player: any) => <div className="h-4 w-full text-sm flex align-middle justify-center">{player}</div>)}
                </div>

                <VerticalSeparatorBar />

                <div className="h-32 w-36 mt-2 mb-2 ml-2 mr-2 flex flex-wrap bg-[#333333]">
                    <div className="h-6 w-full text-xl flex align-middle justify-center orange-stroke">
                        <strong>{props.data.blue.name.length > 12 ? <div>{props.data.orange.name.substring(0,9) + "..."}</div> : <div>{props.data.orange.name}</div>}</strong>
                    </div>
                    {props.data.orange.players.slice(0,4).map((player: any) => <div className="h-4 w-full text-sm flex align-middle justify-center">{player}</div>)}
                </div>

                <VerticalSeparatorBar />

                <div className="h-32 w-24 mt-2 mb-2 ml-2 mr-2 bg-[#333333] flex items-center justify-center flex-wrap">
                    <button type="button" className="w-full h-1/4 flex-wrap text-sm border-2 align-middle border-[#ffffff] bg-[#18A0FB]">Full Data</button>
                    <button type="button" className="w-full h-1/4 flex-wrap text-sm border-2 align-middle border-[#18A0FB] bg-[#ffffff] text-[#18A0FB]">3D View</button>
                    <button type="button" className="w-full h-1/4 flex-wrap text-sm border-2 align-middle border-[#18A0FB] bg-[#ffffff] text-[#18A0FB]">Share</button>
                </div>
            </div>

            {props.data.last === true ? <div></div> : <HorizontalSeparatorBar />}

            {/* <PageButtons /> */}

        </div>
    )
}