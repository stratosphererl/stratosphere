import './App.css'
import HeatmapFromGQL from './gql-components/HeatmapFromGQL'
// import ParseReplay from './gql-components/ParseReplay'
import { UserNameComponent } from './gql-components/usernames'
import ReplayCanvas from './replayViewer/ReplayCanvas'
import StratosphereLogo from './assets/logo.png'
import { Tab } from '@headlessui/react'
import { Fragment } from 'react'

function App() {
  return (
    <div className="App">
      <header className="color">
        <img src={StratosphereLogo} className="block w-25 m-auto logo"/>
        <small className="m-auto block text-center decoration-slate-50 mb-8">pre-Alpha v0.0.3</small>
      </header>
        <Tab.Group>
          <div className='m-auto flex justify-center justify-evenly mb-8'>
            <Tab as={Fragment}>{({ selected }) => (<button className={`${ selected ? 'font-bold' : 'font-normal'}`}>Upload Replay</button>)}</Tab>
            <Tab as={Fragment}>{({ selected }) => (<button className={`${ selected ? 'font-bold' : 'font-normal'}`}>Fetch Players</button>)}</Tab>
            <Tab as={Fragment}>{({ selected }) => (<button className={`${ selected ? 'font-bold' : 'font-normal'}`}>View Replay</button>)}</Tab>
          </div>
          <Tab.Panels>
          <Tab.Panel>
              <HeatmapFromGQL />
            </Tab.Panel>
            <Tab.Panel>
              <UserNameComponent />
            </Tab.Panel>
            <Tab.Panel>
              <ReplayCanvas/>
              </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      
    </div>
  )
}

export default App