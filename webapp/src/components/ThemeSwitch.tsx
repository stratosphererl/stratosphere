import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'

export default function ThemeSwitch() {
  const [enabled, setEnabled] = useState(false)
  const {theme, toggleTheme} = useContext(ThemeContext)

  const handeClick = () => {
    toggleTheme()
  }

  return (
    <div className="flex w-full">
    <Switch
      onClick={handeClick}
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-gray-400' : 'bg-gray-700'
      } relative inline-flex h-6 w-11 items-center rounded-full ml-auto`}
    >
      <span className="sr-only">Switch Mode</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
    </div>
  )
}