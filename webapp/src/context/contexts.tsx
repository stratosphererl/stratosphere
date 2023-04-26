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

// CONTEXTS FOR BROWSE PAGES

// Search Context

export const SearchContext = createContext({
    search: "",
    reviseSearch: (newSearch: string) => {}
})

export const SearchProvider = ({ children }) => {
    const [search, setSearch] = React.useState("")

    const reviseSearch = (newSearch: string) => {
        setSearch(newSearch)
    }

    return (
        <SearchContext.Provider value={{search, reviseSearch}}>
            {children}
        </SearchContext.Provider>
    )
}

// Arena Context

export const ArenaContext = createContext({
    arena: "ANY",
    reviseArena: (arenaName: string) => {}
})

export const ArenaProvider = ({ children }) => {
    const [arena, setArena] = React.useState("ANY")

    const reviseArena = (arenaName: string) => {
        setArena(arenaName)
    }

    return (
        <ArenaContext.Provider value={{arena, reviseArena}}>
            {children}
        </ArenaContext.Provider>
    )
}

// Duration Context

export const DurationContext = createContext({
    duration: "ANY",
    reviseDuration: (durationName: string) => {}
})

export const DurationProvider = ({ children }) => {
    const [duration, setDuration] = React.useState("ANY")

    const reviseDuration = (durationName: string) => {
        setDuration(durationName)
    }

    return (
        <DurationContext.Provider value={{duration, reviseDuration}}>
            {children}
        </DurationContext.Provider>
    )
}

// Gamemode Context

export const GamemodeContext = createContext({
    gamemode: "ANY",
    reviseGamemode: (gamemodeName: string) => {}
})

export const GamemodeProvider = ({ children }) => {
    const [gamemode, setGamemode] = React.useState("ANY")

    const reviseGamemode = (gamemodeName: string) => {
        setGamemode(gamemodeName)
    }

    return (
        <GamemodeContext.Provider value={{gamemode, reviseGamemode}}>
            {children}
        </GamemodeContext.Provider>
    )
}

// Gametype Context

export const GametypeContext = createContext({
    gametype: "ANY",
    reviseGametype: (gametypeName: string) => {}
})

export const GametypeProvider = ({ children }) => {
    const [gametype, setGametype] = React.useState("ANY")

    const reviseGametype = (gametypeName: string) => {
        setGametype(gametypeName)
    }

    return (
        <GametypeContext.Provider value={{gametype, reviseGametype}}>
            {children}
        </GametypeContext.Provider>
    )
}

// Rank Context

export const RankContext = createContext({
    rank: "ANY",
    reviseRank: (rankName: string) => {}
})

export const RankProvider = ({ children }) => {
    const [rank, setRank] = React.useState("ANY")

    const reviseRank = (rankName: string) => {
        setRank(rankName)
    }

    return (
        <RankContext.Provider value={{rank, reviseRank}}>
            {children}
        </RankContext.Provider>
    )
}

// Season Context

export const SeasonContext = createContext({
    season: "ANY",
    reviseSeason: (seasonName: string) => {}
})

export const SeasonProvider = ({ children }) => {
    const [season, setSeason] = React.useState("ANY")

    const reviseSeason = (seasonName: string) => {
        setSeason(seasonName)
    }

    return (
        <SeasonContext.Provider value={{season, reviseSeason}}>
            {children}
        </SeasonContext.Provider>
    )
}