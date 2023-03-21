import { Routes, Route, useParams } from 'react-router-dom';
import ErrorPage from "./Error/error"

export default function Statistics() {
    const params = useParams();

    if (params.version != "0" && params.version != "1") {
        throw new Error("Version parameter must be 0 or 1");
    }

    return (
        <div>statistics.tsx</div>
    );
}