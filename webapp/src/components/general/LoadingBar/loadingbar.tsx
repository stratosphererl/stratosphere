import "./loadingbar.css";

import { useEffect, useState } from "react";

export default function LoadingBar(
    {progress, setProgress, setUploadComplete, uploading, setUploading, statusList, setStatus} : 
    {   statusList: string[],
        setStatus: (status: string) => void
        progress: number, 
        setProgress: (progress: number) => void, 
        setUploadComplete: (uploadComplete: boolean) => void, 
        uploading: boolean, 
        setUploading: (uploading: boolean) => void,
    }
    ) {
        useEffect(() => {
            if(!uploading) return 

            if(progress === 0) {}
            
            // complicated logic to simulate upload
            const id = setInterval(() => {
              setProgress((prev) => {
                const times = [3, 5, 8, 13];
                const status = statusList[Math.floor(Math.random() * statusList.length)];
                setStatus(status);
                const increment = times[Math.floor(Math.random() * times.length)];
                console.log(prev);
                if(prev + increment < 100) 
                  return prev + increment;
                else {
                  clearInterval(id);
                  // wait for catchup
                  setTimeout(() => {
                    setUploadComplete(true);
                    setUploading(false);
                  }, 1000);
                  return 100;
                }
              })
              return () => clearInterval(id);
            }, 2000);
      
          }, [uploading, progress])

    
    return (
        <div className={`loading-bar round`}>
            <div className="loading-bar-progress round" style={{width: `${progress}%`}} />
        </div>
    );
}