import { useParams, useSearchParams } from "react-router-dom";
import useReplay from "../hooks/useReplay";

import { Tab } from "@headlessui/react";
import { useState, Fragment } from "react";

import MainPane from "../components/general/MainPane/mainPane";
import {
  Scoreboard,
  TeamComparison,
  BoostAnalysis,
  PlayerComparison,
  Possession,
  Position,
  Ball,
} from "../components/visualizations/contentPanels";

import Replay2DView from "../components/visualizations/Replay2DView/Replay2DView";
import usePrediction from "../hooks/usePrediction";

export default function Replay() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { data, loading, error } = useReplay(params.replayid!);
  const { 
    data: predictionData, 
    loading: predictionLoading, 
    error: predictionError 
  } = usePrediction(params.replayid!);

  console.log(predictionData, predictionLoading, predictionError)
  
  const regex = /^[A-Z0-9]{32}$/;

  const tabParam = searchParams.get("tab");
  const GROUPS: {
    groupName: string;
    tabs: { tabName: string; content: JSX.Element }[];
  }[] = [
    {
      groupName: "Overview",
      tabs: [
        { tabName: "Scoreboard", content: <Scoreboard data={data} /> },
        { tabName: "Team Comparison", content: <TeamComparison data={data} /> },
        {
          tabName: "Player Comparison",
          content: <PlayerComparison data={data} />,
        },
      ],
    },
    {
      groupName: "Details",
      tabs: [
        { tabName: "Boost", content: <BoostAnalysis data={data} /> },
        { tabName: "Possession", content: <Possession data={data} /> },
        { tabName: "Positioning", content: <Position data={data} /> },
        { tabName: "The Ball", content: <Ball data={data} /> },
      ],
    },
    {
      groupName: "Other",
      tabs: [
        {
          tabName: "2D Replay",
          content: <Replay2DView analyzedReplay={data} />,
        },
      ],
    },
  ];
  const tabIdxMap = new Map<string, number>();
  let tabIdx = 0;
  GROUPS.forEach((group) => {
    group.tabs.forEach((tab) => {
      tabIdxMap.set(tab.tabName.replaceAll(" ", "-"), tabIdx++);
    });
  });

  const [selectedIndex, setSelectedIndex] = useState(tabIdxMap.get(tabParam!) ?? 0);

  if (!regex.test(params.replayid!)) {
    // return <ErrorPage message = "Replay ID parameter must follow regex [A-Z0-9]{32}"/>;
    throw new Error("Replay ID parameter must follow regex [A-Z0-9]{32}");
  }
  if (error) {
    throw error;
  }

  if (loading)
    return (
      <MainPane className="mx-[5%]" title="Replay">
        <h1 className="text-center">Collecting boost...</h1>
      </MainPane>
    );

  return (
    <MainPane className="mx-0 xl:mx-[5%]" title="Replay">
      <div className="p-4 pt-6 glass-inner rounded-2xl text-center h-[200px] flex flex-col justify-center">
        <h1 className="break-words">{params.replayid}</h1>
      </div>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 mt-4 lg:space-x-4">
          <div className="glass-inner rounded-2xl w-full lg:w-[20%] pt-6 p-8 mx-auto">
            <div className="flex flex-col space-y-8">
              {GROUPS.map((group) => (
                <div key={`tab-group-${group.groupName}`}>
                  <h1 className="text-center text-2xl">{group.groupName}</h1>
                  <div className="flex flex-col space-y-2">
                    {group.tabs.map((tab) => (
                      <Tab key={`tab-${tab.tabName}`} as={Fragment}> 
                        {({ selected }) => (
                          <button
                            className={`${
                              selected
                                ? "font-bold bg-stratosphere-blue"
                                : "border-stratosphere-blue text-stratosphere-blue"
                            }
                                border-solid border-2 p-2 xl:mx-5
                                rounded-tl-2xl rounded-br-2xl outline-none`}
                            style={
                              selected
                                ? { borderColor: "white", color: "white" }
                                : { backgroundColor: "white" }
                            }
                          >
                            {tab.tabName}
                          </button>
                        )}
                      </Tab>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-inner rounded-2xl w-full lg:w-[80%] pt-6 p-0 sm:p-8 mx-auto">
            {GROUPS.map((group) =>
              group.tabs.map((tab) => (
                <Tab.Panel key={`tab-content-${tab.tabName}`}>
                  {tab.content}
                </Tab.Panel>
              ))
            )}
          </div>
        </div>
      </Tab.Group>
    </MainPane>
  );
}

