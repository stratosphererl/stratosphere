import ThemeSwitch from "../context/switches"
import { Switch } from '@headlessui/react'
import { ThemeProvider } from '../context/contexts'
import { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/contexts"

export default function Home() {

  // const [user, setUser] = useContext(UserContext)

  const user = useContext(UserContext)

  const userValue = user.user
  const setUserValue = user.reviseUser

  return (
    <div>
      <div style={{height: 972, width: 1912}}>home.tsx</div>
      <div style={{height: 1766, width: 1912}}>TEST</div>
      <div>{JSON.stringify(userValue)}</div>
      <button onClick={() => setUserValue("ABC")}>click this</button>
    </div>
  );
}