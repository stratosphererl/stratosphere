import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Heatmap from "../components/heatmap";
import { LoadingAnimation } from "../components/loading";
import { FileInput } from "../components/userInput";
import img from "../assets/rlgoal.png";

const SET_REPLAY = gql`
mutation Mutation($replay: String) {
  setReplay(replay: $replay) {
    file
  }
}
`

export default function HeatmapFromGQL() {
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
    const heatmapData: {x: number, y: number}[] = [];
        replayData?.properties?.Goals?.forEach((goal: any) => {
            var goalData: {x: number, y: number} = {x: 0, y: 0};
            replayData?.network_frames?.frames?.[goal.frame]?.updated_actors?.forEach( (actor: any) => {
            if (actor?.attribute?.RigidBody?.linear_velocity == null) {
                const position = actor?.attribute?.RigidBody?.location ? actor.attribute.RigidBody.location : undefined;
                if (position)
                    goalData = {x: position.x, y: position.z};
            }
        });
        heatmapData.push(goalData);
    });
  
    return (
      <div className="flex justify-center">
        {
        replayUploaded ? 
        <Heatmap data={heatmapData} image={img} width={1236} height={500} 
        margin={{top: 175, left: 200, right: 100, bottom: 120}} 
        bandwidth={40} binColor={.000125} xDomain={[-750, 750]} yDomain={[0, 550]} />
        : <FileInput onButtonClick={onUpload} allowedExtensions={/(\.replay)$/i} />
        }
      </div>
    );
  }