import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import React, { useState, createContext } from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import './index.css'

import AboutPage from "./routes/about"
import BrowsePage from "./routes/browse"
import ErrorPage from "./routes/error"
import HomePage from "./routes/home"
import LoginPage from "./routes/login"
import OverlayPage from "./routes/overlay"
import RedirectPage from "./routes/redirect"
import ReplayPage from "./routes/replay"
import SettingsPage from "./routes/settings"
import StatsPage from "./routes/statistics"
import UploadPage from "./routes/upload"

import Wrapper from "./components/general/wrapper"

import { HeaderProvider, UserProvider } from "./context/contexts"

const client = new ApolloClient(
  {
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
  }
)

const errorPage = <ErrorPage message = "An unexpected error has occured" />

const router = createBrowserRouter([
  { // redirect.tsx
    path: "/",
    element: <RedirectPage />,
    errorElement: errorPage
  },
  {
    path: "/about",
    element: <Wrapper pageHeight = {1383} background = "background-about"><AboutPage/></Wrapper>,
    errorElement: errorPage
  },
  { // browse.tsx
    path: "/browse/:version",
    element: <Wrapper pageHeight = {2845} background = "background-browse"><BrowsePage/></Wrapper>,
    errorElement: errorPage
  },
  {
    path: "/error",
    element: <Wrapper pageHeight = {1920} background = "">{errorPage}</Wrapper>,
    errorElement: errorPage
  },
  { // home.tsx
    path: "/home",
    element: <Wrapper pageHeight = {3013} background = "background-home"><HomePage/></Wrapper>,
    errorElement: errorPage
  },
  { // login.tsx
    path: "/login",
    element: <Wrapper pageHeight = {1455} background = "background-login"><LoginPage/></Wrapper>,
    errorElement: errorPage
  },
  { // overlay.tsx
    path: "/overlay",
    element: <Wrapper pageHeight = {1459} background = "background-overlay"><OverlayPage/></Wrapper>,
    errorElement: errorPage
  },
  { // replay.tsx
    path: "/replay/:replayid",
    element: <Wrapper pageHeight = {1626} background = "background-replay"><ReplayPage/></Wrapper>,
    errorElement: errorPage
  },
  { // settings.tsx
    path: "/settings",
    element: <Wrapper pageHeight = {1455} background = "background-settings"><SettingsPage/></Wrapper>,
    errorElement: errorPage
  },
  { // statistics.tsx
    path: "/stats/:version",
    element: <Wrapper pageHeight = {1494} background = "background-stats"><StatsPage/></Wrapper>,
    errorElement: errorPage
  },
  { // upload.tsx
    path: "/upload",
    element: <Wrapper pageHeight = {1481} background = "background-upload"><UploadPage/></Wrapper>,
    errorElement: errorPage
  },
]);

// export const UserContext = createContext({});
// const [user, setUser] = useState({id: 0})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <UserProvider>
        <HeaderProvider>
          <RouterProvider router={router} />
        </HeaderProvider>
      </UserProvider>
    </React.StrictMode>
  </ApolloProvider>
)
