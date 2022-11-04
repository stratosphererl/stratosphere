import './index.css';
import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import SceneManager from './replay-viewer/SceneManager';
import * as THREE from 'three';

const GET_ALL_PLAYERS = gql`
query Replays {
  getPlayers {
    username
  }
}
`

const SET_REPLAY = gql`
mutation Mutation($replay: String) {
  setReplay(replay: $replay) {
    file
  }
}
`

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [getReplayBool, setGetReplayBool] = useState(false);
  const [isJSONFile, setIsJSONFile] = useState(false);
            
  useEffect(() => {
    const sm = new SceneManager('replay-viewer');
    sm.animate();

    const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    sm.scene.add(boxMesh);
    
  });

  return (
    <div>
      <div className="pt-12">
        <ParseReplay />
        <canvas id="replay-viewer" />
      </div>
    </div>
  );
}

function ParseReplay() {
  const [replayUploaded, setReplayUploaded] = useState(false);
  const [setReplay, {data, loading, error}] = useMutation(SET_REPLAY);

  const onUpload = (file: File) => {
    setReplay({variables: {replay: file.name}});
    setReplayUploaded(true);
  }

  if (loading)
    return <Loading />;

  if (error)
    return <h1 className="text-red-500 text-3xl">Error</h1>

  return (
    <div>
      {
      replayUploaded ? 
      data : 
      <FileInput onButtonClick={onUpload} allowedExtensions={/(\.replay)$/i} />
      }
    </div>
  );
}

interface ReplayComponentProps {file: File | undefined}
function ReplayComponent(props: ReplayComponentProps) {
  const [replayJSON, setreplayJSON] = useState<any>({});

  if (props.file == null) {
    console.log("File is null");
    return <div />;
  }
  if (!/(\.json)$/i.exec(props.file.name)) {
    console.log("Not a JSON");
    return <div />;
  }

  const fr = new FileReader();
  fr.onload = () => {
    const rJSON = JSON.parse(fr.result as string);
    setreplayJSON(rJSON);
  }
  fr.readAsText(props.file);

  return (
    <div className="px-10 text-center">
      <h1 className="text-5xl font-bold text-purple-600 mb-6">Replay:</h1>
      <div className="text-gray-700 font-semibold">
        <p>Replay name: {replayJSON?.['properties']?.['ReplayName']}</p>
        <p>Uploaded by: {replayJSON?.['properties']?.['PlayerName']}</p>
      </div>
    </div>
  );
}

function UserNameComponent() {
  const [delay, setDelay] = useState(true);
  const {error, data, loading} = useQuery(GET_ALL_PLAYERS);

  useEffect(() => {
    setTimeout(() => {
       console.log("This is a mock delay announcement")
       setDelay(false)
    }, 3000)
  }, []);

  // Change delay to loading later
  if (delay)
    return <Loading />

  if (error)
    return <p>Error you suck!</p>

  let id = 0;
  return (
    <div>
      <div className="text-center">
      <h1 className="text-5xl text-blue-600 font-bold mt-0 mb-6">Player Names</h1>
        {
          data?.getPlayers?.map((player: any) => <p className="text-gray-700 font-semibold" key={++id}>{player.username}</p>)
        }
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="text-center">
      <div role="status">
        <svg className="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-orange-700 fill-blue-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

interface FileInputProps {
  onButtonClick: (file: File) => void;
  allowedExtensions: RegExp;
}
// Functional component encompassing uploading process
function FileInput(props: FileInputProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  // Called when a new file is selected
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;
    setFile(event.target.files[0]);
  }

  // Called when UPLOAD REPLAY button is hit
  const clickHandler = () => {
    if (file == null) return;
    if (!props.allowedExtensions.exec(file.name)) return;
    console.log(file.name);
    props.onButtonClick(file);
  }

  return (
    <div className="flex justify-center">
      <div className="border border-gray-700 rounded mt-3 mb-3 w-96 ">
        <FileSelect changeHandler={changeHandler} />
        <Button text="Upload Replay" clickHandler={clickHandler} />
      </div>
    </div>
  );
}

interface FileSelectProps {changeHandler: (React.ChangeEventHandler<HTMLInputElement>);}
// Gets a file as input
function FileSelect(props: FileSelectProps) {
  return (
    <div>
      <label htmlFor="formFile" className="form-label inline-block mx-2 mb-0 text-gray-700">Select Replay File</label>
      <input className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white 
        first-line:bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 
      focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile" 
        onChange={props.changeHandler} />
    </div>
  );
}

interface ButtonProps {text: string; clickHandler: React.MouseEventHandler<HTMLButtonElement>;}
// A button to do something
// In this case "upload" the replay
function Button(props: ButtonProps) {
  return (
    <div className="flex space-x-2 justify-center">
      <button type="button" className="inline-block w-full py-2.5 bg-blue-600 text-white font-medium 
      text-xs leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
      focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg 
      transition duration-150 ease-in-out"
        onClick={props.clickHandler}>{props.text}</button>
    </div>
  );
}