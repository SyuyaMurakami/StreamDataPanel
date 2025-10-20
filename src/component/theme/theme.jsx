// src/component/theme/theme.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const allThemes = {
  grape: {
    '--primary-color': '#673ab7',
    '--secondary-color': '#6c757d',
    '--background-color': '#673ab7',
    '--text-color': '#eeeeee',
    '--primary-color-hover': 'rgba(81, 45, 168, 1)',
  },
  apple: {
    '--primary-color': '#8eb73a',
    '--secondary-color': '#6c757d',
    '--background-color': '#8eb73a',
    '--text-color': '#eeeeee',
    '--primary-color-hover': 'rgba(105, 153, 7, 1)',
  },
  sky: {
    '--primary-color': '#2196f3',
    '--secondary-color': '#757575',
    '--background-color': '#2196f3',
    '--text-color': '#eeeeee',
    '--primary-color-hover': 'rgba(33, 150, 243, 0.8)',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [currentThemeName, setCurrentThemeName] = useState('grape'); 
  const theme = allThemes[currentThemeName]; 

  useEffect(() => {
    for (const key in theme) {
      document.documentElement.style.setProperty(key, theme[key]);
    }
  }, [theme]);

  const changeTheme = (themeName) => {
    setCurrentThemeName(themeName); 
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, allThemes, currentThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);