import { useState } from "react";
import { LoadingAnimation } from "../components/loading";
import { FileInput } from "../components/userInput";

const SET_REPLAY = gql`
mutation Mutation($replay: String) {
  setReplay(replay: $replay) {
    file
  }
}
`

export default function ParseReplay() {
    const [replayUploaded, setReplayUploaded] = useState(false);
    const [setReplay, {data, loading, error}] = useMutation(SET_REPLAY);
  
    const onUpload = (file: File) => {
      setReplay({variables: {replay: file.name}});
      setReplayUploaded(true);
    }
  
    if (loading)
      return <LoadingAnimation />;
  
    if (error)
      return <h1 className="text-red-500 text-3xl">Error</h1>
  
    const replayData = data ? JSON.parse(data.setReplay.file) : undefined
    const properties = replayData?.properties;
    const blueScore = properties?.Team0Score;
    const orangeScore = properties?.Team1Score;
  
    return (
      <div className="flex justify-center">
        {
        replayUploaded ? 
        <div>
          <h1 className="text-center text-5xl text-gray-700 font-bold mb-3">Replay Data:</h1>
          <div className="font-semibold text-lg">
            <p>Name: "{properties.ReplayName}"</p>
            <p className="text-blue-700">Blue Team Goals: {blueScore ? blueScore : 0}</p>
            <p className="text-orange-700">Orange Team Goals: {orangeScore ? orangeScore : 0}</p>
          </div>
        </div>
        : <FileInput onButtonClick={onUpload} allowedExtensions={/(\.replay)$/i} />
        }
      </div>
    );
  }