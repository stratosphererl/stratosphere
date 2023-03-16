import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
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

const client = new ApolloClient(
  {
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
  }
)

// const errorPage = <ErrorPage message = "A general error has occured"/>
const errorPage = <ErrorPage message = "An unexpected error has occured" />

const router = createBrowserRouter([
  { // redirect.tsx
    path: "/",
    element: <RedirectPage />,
    errorElement: errorPage
  },
  { // about.tsx
    path: "/about",
    element: <AboutPage />,
    errorElement: errorPage
  },
  { // browse.tsx
    path: "/browse/:version",
    element: <BrowsePage />,
    errorElement: errorPage
  },
  { // home.tsx
    path: "/home",
    element: <HomePage />,
    errorElement: errorPage
  },
  { // login.tsx
    path: "/login",
    element: <LoginPage />,
    errorElement: errorPage
  },
  { // overlay.tsx
    path: "/overlay",
    element: <OverlayPage />,
    errorElement: errorPage
  },
  { // replay.tsx
    path: "/replay/:replayid",
    element: <ReplayPage />,
    errorElement: errorPage
  },
  { // settings.tsx
    path: "/settings",
    element: <SettingsPage />,
    errorElement: errorPage
  },
  { // statistics.tsx
    path: "/stats/:version",
    element: <StatsPage />,
    errorElement: errorPage
  },
  { // upload.tsx
    path: "/upload",
    element: <UploadPage />,
    errorElement: errorPage
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ApolloProvider>
)
