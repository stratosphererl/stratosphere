import { useState, useContext } from "react"
import { UserContext } from "../context/contexts"

export default function About() {  
    // const {user, setUser} = useContext(UserContext) // This line WORKS

    const user = useContext(UserContext)

    const userValue = user.user
    const setUserValue = user.reviseUser

    return (
        <div>
            <div>about.tsx</div>
            <div>{JSON.stringify(userValue)}</div>
            <button onClick={() => setUserValue("0")}>click this</button>
        </div>
    )
}