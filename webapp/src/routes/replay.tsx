import { Routes, Route, useParams } from 'react-router-dom';
import ErrorPage from "./error"

export default function Replay() {
    const params = useParams();
    const regex = /^[A-Z0-9]{32}$/

    if (!regex.test(params.replayid!)) {
        return <ErrorPage message = "Replay ID parameter must follow regex [A-Z0-9]{32}"/>;
    }

    // /^([a-z0-9]{5,})$/.test('abc1')

    return (
      <div>replay.tsx</div>
    );
  }