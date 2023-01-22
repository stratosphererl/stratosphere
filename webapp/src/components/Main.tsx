import { Tab } from '@headlessui/react'
import { Fragment } from 'react'
import HeatmapFromGQL from '../gql-components/HeatmapFromGQL'
import { UserNameComponent } from '../gql-components/usernames'
import ReplayCanvas from '../replayViewer/ReplayCanvas'
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'
import SearchReplays from '../filtering/filtering'
import StatisticalData from '../components/StatisticalData'

export default function Main() {
    const {theme} = useContext(ThemeContext)

    const determineTabClass = (selected : boolean) => {
        let className = ""

        className += selected ? 'font-bold' : 'font-normal'
        className += ` ${theme === 'dark' ? 'text-white' : 'text-black'}`

        return className
    }

    return (
        <div className="main">
        <Tab.Group>
          <div className='m-auto flex justify-center justify-evenly mb-8'>
            <Tab as={Fragment}>{({ selected }) => (<button className={determineTabClass(selected)}>Upload Replay</button>)}</Tab>
            <Tab as={Fragment}>{({ selected }) => (<button className={determineTabClass(selected)}>Fetch Players</button>)}</Tab>
            <Tab as={Fragment}>{({ selected }) => (<button className={determineTabClass(selected)}>View Replay</button>)}</Tab>
            <Tab as={Fragment}>{({ selected }) => (<button className={determineTabClass(selected)}>Replay Data</button>)}</Tab>
            <Tab as={Fragment}>{({ selected }) => (<button className={determineTabClass(selected)}>Search Replays</button>)}</Tab>
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
            <Tab.Panel>
              <StatisticalData/>
            </Tab.Panel>
            <Tab.Panel>
              <SearchReplays />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        </div>
    )
}