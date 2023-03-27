import React, { createContext, useEffect } from 'react'

// USER CONTEXT

export const UserContext = createContext({
    user: {id: "0"},
    reviseUser: (input: string) => {}
})

export const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState({id: "0"})

    const reviseUser = (input: any) => {
        const newValue = {id: input}
        localStorage.setItem("STRATOSPHERE_USER", JSON.stringify(newValue))
        setUser(newValue)
    }

    useEffect(() => {
        const newValue = localStorage.getItem("STRATOSPHERE_USER")

        if (newValue === null) {
            setUser({id: "0"})
        } else {
            setUser(JSON.parse(newValue))
        }
    }, [localStorage.getItem("STRATOSPHERE_USER")])

    return (
        <UserContext.Provider value = {{user, reviseUser}}>
            {children}
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