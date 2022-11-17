import { Tab } from '@headlessui/react'
import { Fragment } from 'react'
import HeatmapFromGQL from '../gql-components/HeatmapFromGQL'
import { UserNameComponent } from '../gql-components/usernames'
import ReplayCanvas from '../replayViewer/ReplayCanvas'

export default function Main() {
    return (
        <div className="main">
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