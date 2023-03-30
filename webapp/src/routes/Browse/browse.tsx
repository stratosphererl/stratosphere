import { useParams } from 'react-router-dom';
import MainPane from "../../components/general/mainPane"
import DataComponent from "../../components/replays/data"
import ErrorPage from "../Error/error"
import ReplayJSON from "../../mock/replay.json"

export default function Browse() {
    const params = useParams();

    if (params.version != "0" && params.version != "1") {
        return <ErrorPage message = "Version parameter must be 0 or 1"/>;
    }

    if (params.version === "0") {
        return (
            <MainPane title="Browse Replays" className="browse">
                <div className="glass-inner round p-2">
                    <DataComponent data={ReplayJSON} version={parseInt(params.version)} classname="rounded-lg"/>
                    <HorizontalSpacing/>
                    <DataComponent data={ReplayJSON} version={parseInt(params.version)} classname="rounded-lg"/>
                </div>
            </MainPane>
        );
    } else {
        return (
            <MainPane title="Browse Your Replays" className="browse">
                <div></div>
            </MainPane>
        )
    }
}

export function HorizontalSpacing() {
    return (
        <div style={{height: "0.5rem"}}/>
    )
}