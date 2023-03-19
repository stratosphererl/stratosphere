import React, { createContext, useState, useEffect } from 'react'

// WINDOW SIZE CONTEXT
export const WindowContext = createContext({
    currDims: {width: 0, height: 0},
    changeDims: (newWidth: number, newHeight: number) => {}
})

export const WindowProvider = ({ children }) => {
    const [currDims, setCurrDims] = React.useState({width: 0, height: 0})

    const changeDims = (newWidth: number, newHeight: number) => {
        setCurrDims({width: newWidth, height: newHeight})
    }

    useEffect(() => {
        changeDims(window.innerWidth, window.innerHeight)
    }, [currDims])

    return (
        <WindowContext.Provider value={{currDims, changeDims}}>
            { children }
        </WindowContext.Provider>
    )
}

// HEADER CONTEXT
export const HeaderContext = createContext({
    showDropdown: false,
    toggleDropdown: () => {}
})

export const HeaderProvider = ({ children }) => {
    const [showDropdown, setShowDropdown] = React.useState(false)

    const toggleDropdown = () => {
        console.log(showDropdown)
        if (showDropdown === false) {
            setShowDropdown(true)
        } else {
            setShowDropdown(false)
        }
    }

    return (
        <HeaderContext.Provider value={{showDropdown, toggleDropdown}}>
            { children }
        </HeaderContext.Provider>
    )
}

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