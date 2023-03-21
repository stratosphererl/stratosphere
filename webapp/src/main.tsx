import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import AboutPage from "./routes/about"
import BrowsePage from "./routes/browse"
import HomePage from "./routes/home"
import LoginPage from "./routes/login"
import OverlayPage from "./routes/overlay"
import RedirectPage from "./routes/redirect"
import ReplayPage from "./routes/replay"
import SettingsPage from "./routes/settings"
import StatsPage from "./routes/statistics"
import UploadPage from "./routes/upload"
import ErrorPage from "./routes/Error/error"

import Wrapper from "./components/general/wrapper"

import { UserProvider} from "./context/contexts"

const client = new ApolloClient(
  {
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
  }
)

function ErrorBoundary() {
  let error = useRouteError();
  return <Wrapper background=''><ErrorPage message = {`${error}`} /></Wrapper>
}


const router = createBrowserRouter([
  { // redirect.tsx
    path: "/",
    element: <RedirectPage />,
    errorElement: <ErrorBoundary/>
  },
  {
    path: "/about",
    element: <Wrapper background = "background-about"><AboutPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // browse.tsx
    path: "/browse/:version",
    element: <Wrapper background = "background-browse"><BrowsePage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  {
    path: "/error",
    element: <Wrapper background = "">{<ErrorBoundary/>}</Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // home.tsx
    path: "/home",
    element: <Wrapper background = "background-home"><HomePage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // login.tsx
    path: "/login",
    element: <Wrapper background = "background-login"><LoginPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // overlay.tsx
    path: "/overlay",
    element: <Wrapper background = "background-overlay"><OverlayPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // replay.tsx
    path: "/replay/:replayid",
    element: <Wrapper background = "background-replay"><ReplayPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // settings.tsx
    path: "/settings",
    element: <Wrapper background = "background-settings"><SettingsPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // statistics.tsx
    path: "/stats/:version",
    element: <Wrapper background = "background-stats"><StatsPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
  { // upload.tsx
    path: "/upload",
    element: <Wrapper background = "background-upload"><UploadPage/></Wrapper>,
    errorElement: <ErrorBoundary/>
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <UserProvider>
          <RouterProvider router={router} />
      </UserProvider>
    </React.StrictMode>
  </ApolloProvider>
)
