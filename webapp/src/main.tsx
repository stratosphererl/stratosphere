import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import React, {Suspense, lazy} from "react";
import ReactDOM from "react-dom";
import "./index.css";

const AboutPage = lazy(() => import("./routes/about"));
const BrowsePage = lazy(() => import("./routes/Browse/browse"));
const HomePage = lazy(() => import("./routes/Home/home"));
const LoginPage = lazy(() => import("./routes/Login/login"));
const OverlayPage = lazy(() => import("./routes/overlay"));
const ReplayPage = lazy(() => import("./routes/replay"));
const SettingsPage = lazy(() => import("./routes/Settings/settings"));
const StatsPage = lazy(() => import("./routes/Statistics/statistics"));
const UploadPage = lazy(() => import("./routes/upload"));
const Wrapper = lazy(() => import("./components/general/wrapper"));

import RedirectPage from "./routes/redirect";
import ErrorPage from "./routes/Error/error";

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
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-about" callPage="">
          <AboutPage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // browse.tsx
    path: "/browse/:version",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-browse" callPage="">
          <BrowsePage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/error",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="" callPage="">
          {<ErrorBoundary />}
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // home.tsx
    path: "/home",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-home" callPage="Home">
          <HomePage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // login.tsx
    path: "/login",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-login" callPage="">
          <LoginPage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // overlay.tsx
    path: "/overlay",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-overlay" callPage="">
          <OverlayPage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // replay.tsx
    path: "/replay/:replayid",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-replay" callPage="">
          <ReplayPage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // settings.tsx
    path: "/settings",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-settings" callPage="">
          <SettingsPage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // statistics.tsx
    path: "/stats/:version",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-stats" callPage="">
          <StatsPage />
        </Wrapper>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    // upload.tsx
    path: "/upload",
    element: (
      <Suspense fallback={<h1></h1>}>
        <Wrapper background="background-upload" callPage="">
          <UploadPage />
        </Wrapper>
      </Suspense>
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
