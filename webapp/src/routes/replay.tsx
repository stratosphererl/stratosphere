import { useParams } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import ErrorPage from "./Error/error"

export default function Replay() {
    const params = useParams();
    const regex = /^[A-Z0-9]{32}$/

    if (!regex.test(params.replayid!)) {
      // return <ErrorPage message = "Replay ID parameter must follow regex [A-Z0-9]{32}"/>;
        throw new Error("Replay ID parameter must follow regex [A-Z0-9]{32}");
    }

    return (
      <div>replay.tsx</div>
    );
}