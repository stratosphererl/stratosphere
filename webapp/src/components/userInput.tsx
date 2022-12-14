import { useState } from "react";
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'

// Functional component encompassing uploading process
export function FileInput(props: {
        onButtonClick: (file: File) => void;
        allowedExtensions: RegExp;
    }) {
    const [file, setFile] = useState<File | undefined>(undefined);
    // Called when a new file is selected
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files == null) return;
      setFile(event.target.files[0]);
    }

    // Called when UPLOAD REPLAY button is hit
    const clickHandler = () => {
      if (file == null) {
        alert('Silly. Input something next time.')
        return
      };
      if (!props.allowedExtensions.exec(file.name)) {
        alert(`Unsupported file extension. We only supported .replays!`)
        return
      };
      console.log(file.name);
      props.onButtonClick(file);
    }
    return (
        <div className="mt-3 mb-3 w-96">
          <FileSelect changeHandler={changeHandler} />
          <Button text="Upload Replay" clickHandler={clickHandler} />
        </div>
      );
}

// Gets a file as input
export function FileSelect(props: {changeHandler: (React.ChangeEventHandler<HTMLInputElement>);}) {
  const {theme} = useContext(ThemeContext)
  
  return (
    <div>
      <label htmlFor="formFile" className={`form-label inline-block mx-2 mb-0 ${theme === 'dark' ? 'text-gray-300' : ' text-black'}`}>Select Replay File</label>
      <input className="block w-full rounded-sm text-base font-normal text-gray-700 bg-white 
        first-line:bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 
      focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile" 
        onChange={props.changeHandler} />
    </div>
  );
}

// A button to do something
// In this case "upload" the replay
export function Button(props: {text: string; clickHandler: React.MouseEventHandler<HTMLButtonElement>;}) {
  return (
    <div className="flex justify-center">
      <button type="button" className="inline-block w-full py-2.5 bg-blue-600 text-white font-medium 
      text-xs leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
      focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg 
      transition duration-150 ease-in-out"
        onClick={props.clickHandler}>{props.text}</button>
    </div>
  );
}