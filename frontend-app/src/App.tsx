import './index.css';
import React, { useState } from 'react';

export default function App() {
  return (
    <FileInput />
  );
}

// Functional component encompassing uploading process
function FileInput() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  // Called when a new file is selected
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  }

  // Called when UPLOAD REPLAY button is hit
  const clickHandler = () => {
    console.log(selectedFile?.name);
    console.log('Replay uploaded!');
  }

  return (
    <div className="flex justify-center">
      <div className="border border-gray-700 rounded mt-3 mb-3 w-96 ">
        <label htmlFor="formFile" className="form-label inline-block mx-2 mb-0 text-gray-700">Select Replay File</label>
        {/* File input */}
        <input className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white 
        bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 
        focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile" 
          onChange={changeHandler}
        />
        <div className="flex space-x-2 justify-center">
          {/* Upload button */}
          <button type="button" className="inline-block w-full py-2.5 bg-blue-600 text-white font-medium 
          text-xs leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 
          focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg 
          transition duration-150 ease-in-out"
            onClick={clickHandler}
          >Upload Replay</button>
        </div>
      </div>
    </div>
  );
}
