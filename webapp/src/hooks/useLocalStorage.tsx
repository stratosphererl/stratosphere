import React, { useState, useEffect } from "react"


export default function setLocalStorage(key: string, newValue: any) {
    const [value, setValue] = React.useState(null)

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(newValue))
    }, [key]);


    // const localUser = JSON.parse(localStorage.getItem('userData')) || {};
    // let [userData, setUserData] = useState(localUser);

    // const returnValue = localStorage.getItem(key)

    // if (newValue) {
    //     setValue(newValue)
    //     localStorage.setItem(key, JSON.stringify(newValue))
    // } else {
    //     if (returnValue === null) {
    //         return null
    //     } else {
    //         JSON.parse(returnValue)
    //     }
    // }

    // return 
}