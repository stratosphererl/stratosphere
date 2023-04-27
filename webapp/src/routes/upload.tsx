import MainPane from "../components/general/MainPane/mainPane";
import DropZone from "../components/dropzone";
import LoadingBar from "../components/general/LoadingBar/loadingbar";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/contexts";
import { progressMessages as statusList } from "../constants/statusMessages";
import useProgress from "../hooks/useProgress";

import { useLazyQuery, useMutation, gql } from "@apollo/client";

const UPLOAD_REPLAY = gql`
  mutation Mutation($file: Upload!) {
    uploadReplay(file: $file) {
      taskId
    }
  }
`;

const GET_UPLOAD_STATUS = gql`
  query Query($taskId: String!) {
    getTaskStatus(taskId: $taskId) {
      state
      status {
        replay_id
        process_time
        stage {
          name
          current
          total
        }
      }
    }
  }
`;

export default function Upload() {
  const videoURL = "https://www.youtube.com/embed/b99rO8kHCX4";
  const POLL_EVERY = 3000;

  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const { progress, status } = useProgress({
    defaultStatus: "Ready for kickoff!",
  });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [getStatus, { data, error, stopPolling }] = useLazyQuery(
    GET_UPLOAD_STATUS,
    {
      pollInterval: POLL_EVERY,
    }
  );
  const [startUpload, upload] = useMutation(UPLOAD_REPLAY, {
    onCompleted: () => {
      console.log(upload.data.uploadReplay[0].taskId);
      getStatus({ variables: { taskId: upload.data.uploadReplay[0].taskId } });
    },
  });

  const loggedIn = user.id !== "0";

  const completeProgress = () => {
    stopPolling();
    setFile(undefined);
    setUploading(false);
    navigate("/replay/FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    progress.set(0);
  };

  useEffect(() => {
    if (!data) return;
    if (error) {
      status.set(error.message);
      setTimeout(() => {
        setFile(undefined);
        setUploading(false);
        progress.set(0);
        stopPolling();
      }, 1000);
    }
    if (data.getTaskStatus.state === "SUCCESS") {
      status.set(
        "Your replay is just about ready! Sit tight for the final touches."
      );
      setTimeout(() => {
        completeProgress();
      }, 1000);
    }
    progress.set(data.getTaskStatus.status.stage.current * 25);
    const statusMessage =
      statusList[Math.floor(Math.random() * statusList.length)];
    status.set(statusMessage);
  }, [data]);

  const startProgress = () => {
    setUploading(true);
    startUpload({ variables: { file: file } });
    progress.set(0);
  };

  return (
    <MainPane className="max-w-[800px]" title="Upload">
      <iframe
        className="m-auto round border-white w-full"
        src={videoURL}
        height="315"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
      {!loggedIn ? (
        <div className="mt-10">
          <p className="text-center">
            You must be logged in to upload replays.
          </p>
          <div className="flex justify-center">
            <a className="mt-3 primary-btn" href="/login">
              Login
            </a>
          </div>
        </div>
      ) : (
        <div>
          <DropZone file={file} setFile={setFile} />
          <div className="flex justify-center mt-10">
            {uploading ? (
              <div className={"glass-inner w-full p-3 round"}>
                <LoadingBar progress={progress.value} />
                <p className="text-center mt-5">Uploading: {status.value}</p>
              </div>
            ) : (
              <button
                onClick={startProgress}
                disabled={!file}
                className="primary-btn"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      )}
    </MainPane>
  );
}
