import React, { createContext, useState, useEffect } from 'react'

// USER CONTEXT

export const UserContext = createContext({
    user: {id: "0"},
    reviseUser: (id: string) => {}
})

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({id: "0"})

    const reviseUser = (id: string) => {
        setUser({id: id})
        localStorage.setItem("STRATOSPHERE_USER", JSON.stringify(id))
    }

    return (
        <UserContext.Provider value={{user, reviseUser}}>
            { children }
        </UserContext.Provider>
    )
}

// THEME CONTEXT

export const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => {}
})

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = React.useState('dark')

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light')
            document.body.style.backgroundColor = '#f7fafc'
        } else {
            setTheme('dark')
            document.body.style.backgroundColor = '#1a202c'
        }
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}