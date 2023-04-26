import { useState } from "react";

export default function useProgress({defaultStatus = ""} : {defaultStatus?: string} = {}) {
    const [progressValue, setProgressValue] = useState(0);
    const [statusValue, setStatusValue] = useState(defaultStatus ? defaultStatus : "");
    const [errorValue, setErrorValue] = useState("");

    return {
        progress : {
            value: progressValue,
            set: setProgressValue
        }, 
        status : {
            value: statusValue,
            set: setStatusValue
        },
        error : {
            value: errorValue,
            set: setErrorValue
        },
        reset : () => {
            setProgressValue(0);
            setStatusValue(defaultStatus ? defaultStatus : "");
            setErrorValue("");
        }
    };
}