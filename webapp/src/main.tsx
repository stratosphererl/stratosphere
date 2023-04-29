import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import AboutPage from "./routes/about";
import BrowsePage from "./routes/Browse/browse";
import HomePage from "./routes/Home/home";
import LoginPage from "./routes/Login/login";
import OverlayPage from "./routes/overlay";
import RedirectPage from "./routes/redirect";
import ReplayPage from "./routes/replay";
import SettingsPage from "./routes/Settings/settings";
import StatsPage from "./routes/Statistics/statistics";
import UploadPage from "./routes/upload";
import ErrorPage from "./routes/Error/error";
import DataPage from "./components/replays/data";
import ReplayJSON from "./mock/replay.json";

import Wrapper from "./components/general/wrapper";

import { UserProvider, SearchProvider } from "./context/contexts";
import {
  ArenaProvider,
  DurationProvider,
  GamemodeProvider,
  GametypeProvider,
  RankProvider,
  SeasonProvider,
} from "./context/contexts";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  link: createUploadLink({
    headers: { "Apollo-Require-Preflight": "true" },
    uri: "http://localhost:4000/graphql",
  }),
});

function ErrorBoundary() {
  let error = useRouteError();
  return (
    <Wrapper background="" callPage="">
      <ErrorPage message={`${error}`} />
    </Wrapper>
  );
}

const router = createBrowserRouter([
  {
    // redirect.tsx
    path: "/",
    element: <RedirectPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/about",
    element: (
      <Wrapper background="background-about" callPage="">
        <AboutPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // browse.tsx
    path: "/browse/:version",
    element: (
      <Wrapper background="background-browse" callPage="">
        <BrowsePage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/error",
    element: (
      <Wrapper background="" callPage="">
        {<ErrorBoundary />}
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // home.tsx
    path: "/home",
    element: (
      <Wrapper background="background-home" callPage="Home">
        <HomePage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // login.tsx
    path: "/login",
    element: (
      <Wrapper background="background-login" callPage="">
        <LoginPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // overlay.tsx
    path: "/overlay",
    element: (
      <Wrapper background="background-overlay" callPage="">
        <OverlayPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // replay.tsx
    path: "/replay/:replayid",
    element: (
      <Wrapper background="background-replay" callPage="">
        <ReplayPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // settings.tsx
    path: "/settings",
    element: (
      <Wrapper background="background-settings" callPage="">
        <SettingsPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // statistics.tsx
    path: "/stats/:version",
    element: (
      <Wrapper background="background-stats" callPage="">
        <StatsPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // upload.tsx
    path: "/upload",
    element: (
      <Wrapper background="background-upload" callPage="">
        <UploadPage />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/data",
    element: (
      <Wrapper background="background-white" callPage="">
        <DataPage data={ReplayJSON} version={0} />
        <DataPage data={ReplayJSON} version={1} />
      </Wrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
]);

export function RouterWithContextsProvider() {
  return (
    <UserProvider>
      <SearchProvider>
        <ArenaProvider>
          <DurationProvider>
            <GamemodeProvider>
              <GametypeProvider>
                <RankProvider>
                  <SeasonProvider>
                    <RouterProvider router={router} />
                  </SeasonProvider>
                </RankProvider>
              </GametypeProvider>
            </GamemodeProvider>
          </DurationProvider>
        </ArenaProvider>
      </SearchProvider>
    </UserProvider>
  );
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <RouterWithContextsProvider />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);
