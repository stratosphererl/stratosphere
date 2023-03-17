import React, { createContext } from "react";

export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState("dark");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.body.style.backgroundColor = "#f7fafc";
    } else {
      setTheme("dark");
      document.body.style.backgroundColor = "#1a202c";
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}