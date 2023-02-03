import { responsePathAsArray } from "graphql";
import { useEffect, useRef, useState } from "react"
import rankImages from './ranks';

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
                <div className="h-10 w-full rounded-full bg-[#333333] border-[#555555] border-2">
                    <div className="ml-4 mr-4">
                        <input onChange={onChange} type="search" className="focus:outline-none h-8 mt-0.5 w-full bg-transparent text-[#ffffff] text-left text-sm flex items-center bg-[#333333]" placeholder="SEARCH..." />
                    </div>
                </div>
                {/* <button type="button" className="w-2/12 bg-[#333333] flex-wrap text-sm ml-3 mr-3 border-2 align-middle border-[#ffffff] bg-[#18A0FB]">SEARCH</button> */}
            </div>

            <div className="flex flex-nowrap mb-2 justify-center items-center -ml-1 -mr-1">
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
        <div className="h-10 w-1/6 rounded-full bg-[#333333] flex flex-wrap justify-center items-center ml-1 mr-1 border-[#555555] border-2">
            <form>
                <select name="arenas" id="arenas" className="bg-[#333333] w-44"> {/* Implement multiple, and hiding */} {/* add onChange */} 
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

// export function PageButtons() {
//     return (
//         <div className="flex justify-center align-middle mt-4">
//             <button type="button" className="w-32 h-8 flex-wrap text-sm border-2 align-middle border-[#ffffff] bg-[#18A0FB] mr-2">Previous Page</button>
//             <div className="w-1/12 h-8 flex align-middle justify-center bg-[#333333]">
//                 <div className="mt-1">1 / 9999</div>
//             </div>
//             <button type="button" className="w-32 h-8 flex-wrap text-sm border-2 align-middle border-[#ffffff] bg-[#18A0FB] ml-2">Next Page</button>
//         </div>
//     )
// }

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
    rank: {
        name: string;
        num: number;
    }
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
    last: number;
};

type DataBlockItem = {
    title: string
    firstText: string
    secondText: string
    thirdText: string
}

export function Score(props: {blueScore: number, orangeScore: number}) {
    return (
        props.blueScore > props.orangeScore ?
            <div className="text-5xl ml-2 mr-2 blue-stroke-2"><strong>{props.blueScore} - {props.orangeScore}</strong></div> :
            <div className="text-5xl ml-2 mr-2 orange-stroke-2"><strong>{props.orangeScore} - {props.blueScore}</strong></div>
    )
}

export function Truncation(props: {text: string, maxLen: number}) {
    return (
        <strong>
            {props.text.length > props.maxLen ? 
                <div>{props.text.substring(0,props.maxLen - 3) + "..."}</div> :
                <div>{props.text}</div>}
        </strong>
    )
}

export function DataRow(props: {title: string, firstText: string, secondText?: string, thirdText?: string}) {
    return (
        props.thirdText != "" ?
            props.secondText != "" ?
                <div className="h-4 w-full text-sm flex align-middle justify-center"> <strong><u>{props.title}</u></strong>: {props.firstText} ({props.secondText} {props.thirdText})</div> :
                <div className="h-4 w-full text-sm flex align-middle justify-center"> <strong><u>{props.title}</u></strong>: {props.firstText} ({props.thirdText})</div>
            :
        <div className="h-4 w-full text-sm flex align-middle justify-center"> <strong><u>{props.title}</u></strong>: {props.firstText}</div>
    )
}

export function DataBlock(props: {items: DataBlockItem[]}) {
    return (
        props.items.map((item: any) => <DataRow title={item.title} firstText={item.firstText} secondText={item.secondText} thirdText={item.thirdText}/>)
    )
}

export function Button(props: {width: string, height: string, text: string, borderColor: string, bgColor: string}) {
    const widthStr = "w-" + props.width
    const heightStr = "h-" + props.height
    const borderStr = "border-[#" + props.borderColor +"]"
    const bgStr = "bg-[#" + props.bgColor + "]"
    const textColorStr = "text-[#" + props.borderColor + "]"
    
    const classNameString = widthStr + " " + heightStr + " " + borderStr + " " + bgStr + " " + textColorStr + " border-2 text-sm"

    return (
        <button type="button" className={classNameString}>{props.text}</button>
    )
}

export function Replay(props: {data: ReplayData}) {
    return (
        <div className="mb-2">
            <div className="flex flex-nowrap-36 bg-[#333333] border-[#555555] border-2">
                <div className="h-32 w-44 mt-2 mb-2 ml-2 mr-2 flex items-center justify-center">
                    <Score blueScore={props.data.blue.score} orangeScore={props.data.orange.score}/>                    
                </div>
                
                <VerticalSeparatorBar />

                <div key={props.data.title} className="h-32 w-96 mt-2 mb-2 ml-2 mr-2 flex flex-wrap justify-center">
                    <div className="h-6 w-full text-xl flex flex-wrap justify-center"><Truncation text={props.data.title} maxLen={26}/></div>
                    <DataBlock items={[
                            {title: "Uploaded", firstText: props.data.uploaded.date, secondText: props.data.uploaded.time, thirdText: "GMT"},
                            {title: "Played", firstText: props.data.played.date, secondText: props.data.played.time, thirdText: "GMT"},
                            {title: "Uploader", firstText: props.data.uploader, secondText: "", thirdText: ""},
                            {title: "Arena", firstText: props.data.arena, secondText: "", thirdText: ""}]}/>
                </div>
                
                <VerticalSeparatorBar />

                <div className="h-32 w-72 mt-2 mb-2 ml-2 mr-2 flex flex-wrap">
                    <div className="h-6 w-full text-xl flex align-middle justify-center"><img src={rankImages[props.data.rank.num]} alt="" className="mr-1 -mt-1 -mb-1"></img><strong>{props.data.rank.name}</strong></div>
                    { props.data.overtime != "0:00" ?
                        <DataBlock items={[
                            {title: "Duration", firstText: props.data.duration, secondText: props.data.overtime, thirdText: "OT"},
                            {title: "Season", firstText: props.data.season, secondText: "", thirdText: ""},
                            {title: "Gamemode", firstText: props.data.gamemode, secondText: "", thirdText: ""},
                            {title: "Gametype", firstText: props.data.gametype, secondText: "", thirdText: ""}
                        ]}/>
                        :
                        <DataBlock items={[
                            {title: "Duration", firstText: props.data.duration, secondText: "", thirdText: "no OT"},
                            {title: "Season", firstText: props.data.season, secondText: "", thirdText: ""},
                            {title: "Gamemode", firstText: props.data.gamemode, secondText: "", thirdText: ""},
                            {title: "Gametype", firstText: props.data.gametype, secondText: "", thirdText: ""}
                        ]}/>
                    }
                </div>
                
                <VerticalSeparatorBar />

                <div className="h-32 w-36 mt-2 mb-2 ml-2 mr-2 flex flex-wrap bg-[#333333]">
                    <div className="h-6 w-full text-xl flex align-middle justify-center blue-stroke">
                        <strong><Truncation text={props.data.blue.name} maxLen={12}/></strong>
                    </div>
                    {props.data.blue.players.slice(0,4).map((player: any) => <div className="h-4 w-full text-sm flex align-middle justify-center">{player}</div>)}
                </div>

                <VerticalSeparatorBar />

                <div className="h-32 w-36 mt-2 mb-2 ml-2 mr-2 flex flex-wrap bg-[#333333]">
                    <div className="h-6 w-full text-xl flex align-middle justify-center orange-stroke">
                        <strong><Truncation text={props.data.orange.name} maxLen={12}/></strong>
                    </div>
                    {props.data.orange.players.slice(0,4).map((player: any) => <div className="h-4 w-full text-sm flex align-middle justify-center">{player}</div>)}
                </div>

                <VerticalSeparatorBar />

                <div className="h-32 w-24 mt-2 mb-2 ml-2 mr-2 bg-[#333333] flex items-center justify-center flex-wrap">
                    <Button width="full" height="1/4" text="Full Data" borderColor="ffffff" bgColor="18A0FB"/>
                    <Button width="full" height="1/4" text="3D View" borderColor="18A0FB" bgColor="ffffff"/>
                    <Button width="full" height="1/4" text="Share" borderColor="18A0FB" bgColor="ffffff"/>
                </div>
            </div>

            {props.data.last === 1 ? <div></div> : <HorizontalSeparatorBar />}

            {/* <PageButtons /> */}

        </div>
    )
}