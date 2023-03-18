import ThemeSwitch from "../context/switches"
import { Switch } from '@headlessui/react'
import { ThemeProvider } from '../context/contexts'
import { useState, useEffect, useContext } from "react"
import { UserContext } from "../context/contexts"

export default function Home() {

  return (
    <div>
      <div style={{height: 972, width: 1912}}>home.tsx</div>
      <div style={{height: 1766, width: 1912}}>TEST</div>
    </div>
  );
}