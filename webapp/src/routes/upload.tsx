import MainPane from "../components/general/mainPane";
import DropZone from "../components/dropzone";
import LoadingBar from "../components/general/LoadingBar/loadingbar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
    const videoURL = "https://www.youtube.com/embed/b99rO8kHCX4"
    const [file, setFile] = useState<File>();
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Ready for kickoff!");
    const navigate = useNavigate();

    const statusList = [
      "Commencing countdown, engines on...",
      "Refueling the rocket engines for a speedy upload...",
      "Boosting for a smooth upload experience...",
      "Strapping in your replay for lift-off...",
      "Analyzing your epic saves and clutch goals...",
      "Performing aerial maneuvers to optimize replay file size...",
      "Calibrating the boost tanks for maximum performance...",
      "Analyzing your playstyle for strategic insights...",
      "Checking the stats on your wheels and boost pads...",
      "Recharging the boost tanks for a speedy upload...",
      "Testing the ball trajectory for accurate analysis...",
      "Running diagnostics on your car's air freshener...",
      "Engaging rocket thrusters for optimal style points...",
      "Checking your car's cup holder for any loose beverages...",
      "Adjusting the stadium's gravity settings to match your playstyle...",
      "Polishing the ball for maximum aerodynamics...",
      "Performing a thorough inspection of the goalposts for any sneaky bugs...",
      "Calibrating the crowd's enthusiasm levels for maximum hype...",
      "Analyzing your teammate's chat history for communication tips...",
      "Checking the weather forecast to ensure perfect playing conditions...",
      "Performing a routine check of the stadium's hot dog stands for any technical difficulties..."
    ]

    const upload = async () => {
        setProgress(0);
        setUploadComplete(false);
        setUploading(true);
    }

    const onUploadComplete = () => {
        setFile(undefined);
        setUploadComplete(true);
        navigate("/replay/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
        navigate(0);
    }

    return (
        <MainPane className="max-w-[800px]" title="Upload">
            <iframe className="m-auto round border-white w-full" src={videoURL} height="315"  title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            <DropZone file={file} setFile={setFile}/>
            <div className="flex justify-center mt-10">
              {
                uploading ?
                <div className={"glass-inner w-full p-3 round"}>
                  <LoadingBar setUploading={setUploading} uploading={uploading} progress={progress} setProgress={setProgress} setUploadComplete={onUploadComplete} statusList={statusList} setStatus={setStatus}/>
                  <p className="text-center mt-5">Uploading: {status}</p>
                </div> :
                <button onClick={upload} disabled={!file} className="primary-btn">Upload</button>
              }
            </div>
        </MainPane>  
    );
  
}