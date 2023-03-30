import { useParams } from 'react-router-dom';
import MainPane from "../../components/general/mainPane"
import "./statistics.css"

export default function Statistics() {
    const params = useParams();

    // TODO: Implement gathering of data below

    const numUsers = "..."
    const steamPlayers = "..."
    const epicPlayers = "..."
    const xboxPlayers = "..."
    const psnPlayers = "..."

    const replaysDataString = "..."
    const goalsDataString = "..."
    const assistsDataString = "..."
    const savesDataString = "..."
    const shotsDataString = "..."

    if (params.version != "0" && params.version != "1") {
        throw new Error("Version parameter must be 0 or 1");
    }

    if (params.version === "0") {
        return (
            <MainPane title="Population Stats" className="statistics">
                <div className="glass-inner round data-pane flex flex-nowrap justify-center items-center">
                    <div className="title-column"><b><i>UNIQUE PLAYERS</i></b></div>
                    <VerticalBar rightMargin={false}/>
                    <DataColumn title="STRATOSPHERE ACCOUNTS" data={numUsers} class={1}/>
                    <VerticalBar rightMargin={false}/>
                    <div className="chart-column">
                        <div className="pie-chart-mock flex justify-center items-center">placeholder</div>
                    </div>
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

export function GraphPane(props: {paneTitle: string}) {
    return (
        <div className="glass-inner round data-pane flex flex-nowrap justify-center items-center">
            <div className="title-column"><b><i>{props.paneTitle}</i></b></div>
            <VerticalBar rightMargin={false}/>
            <div className="graph-column">--GRAPH PLACEHOLDER--</div>
            <VerticalBar rightMargin={true}/>
        </div>
    )
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