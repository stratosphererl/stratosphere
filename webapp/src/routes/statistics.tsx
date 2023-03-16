import { Routes, Route, useParams } from 'react-router-dom';
import ErrorPage from "./error"

export default function Statistics() {
    const params = useParams();

    if (params.version != "0" && params.version != "1") {
        return <ErrorPage message = "Version parameter must be 0 or 1"/>;
    }

    return (
        <div>statistics.tsx</div>
    );
}