import { useParams } from 'react-router-dom';
import useReplay from '../hooks/useReplay';

import { Tab } from '@headlessui/react';
import { Fragment } from 'react';

import MainPane from '../components/general/mainPane';
import { Scoreboard, TeamComparison, BoostAnalysis } from '../components/visualizations/contentPanels';

export default function Replay() {
    const params = useParams();
    const regex = /^[A-Z0-9]{32}$/

    const { data, loading, error } = useReplay(params.replayid!);

    if (error || !regex.test(params.replayid!)) {
      // return <ErrorPage message = "Replay ID parameter must follow regex [A-Z0-9]{32}"/>;
        throw new Error("Replay ID parameter must follow regex [A-Z0-9]{32}");
    }
    
    if (loading) 
        return (<MainPane className="mx-[5%]" title="Replay"><h1 className="text-center">Collecting boost...</h1></MainPane>);

    const GROUPS: { groupName: string, tabs: { tabName: string, content: JSX.Element}[]}[] = [
        { groupName: "Overview", tabs: [
            { tabName: "Scoreboard", content: <Scoreboard data={data} /> },
            { tabName: "Team Comparison", content: <TeamComparison data={data} /> },
        ]},
        { groupName: "Player Comparisons", tabs: [
            { tabName: "Boost Analysis", content: <BoostAnalysis data={data} /> },
        ]},
    ];

    return (
        <MainPane className="mx-[5%]" title="Replay">
            <div className="p-4 pt-6 glass-inner rounded-2xl text-center h-[200px] flex flex-col justify-center" >
                <h1 className="break-words">{params.replayid}</h1>
            </div>
            <Tab.Group>
                <div className="flex mt-4 space-x-4">
                    <div className="glass-inner rounded-2xl w-[20%] pt-6 p-8">
                        <div className="flex flex-col space-y-8">{
                            GROUPS.map((group) =><div>
                                <h1 className="text-center">{group.groupName}</h1>
                                <div className="flex flex-col space-y-2">{
                                    group.tabs.map((tab) => 
                                        <Tab as={Fragment} >
                                            {({ selected }) => 
                                            <button className={
                                                `${selected ? 'font-bold bg-stratosphere-blue' : 'border-stratosphere-blue text-stratosphere-blue'}
                                                border-solid border-2 p-2 mx-5
                                                rounded-tl-2xl rounded-br-2xl outline-none`
                                            } style={selected ? {borderColor: "white", color: "white"} : {backgroundColor: "white"}}>{tab.tabName}</button>}
                                        </Tab>
                                    )
                                }</div>
                            </div>)}
                        </div>
                    </div>
                    <div className="glass-inner rounded-2xl w-[80%] pt-6 p-8" >
                        {GROUPS.map((group) => group.tabs.map((tab) => <Tab.Panel>{tab.content}</Tab.Panel>))}
                    </div>
                </div>
            </Tab.Group>
        </MainPane>
    );
}