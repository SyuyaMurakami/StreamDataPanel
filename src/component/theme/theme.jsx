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
  coffee: {
    '--primary-color': '#5D4037',
    '--secondary-color': '#A1887F',
    '--background-color': '#4E342E',
    '--text-color': '#FBEFF4',
    '--primary-color-hover': 'rgba(121, 85, 72, 0.8)',
  },
  night: {
    '--primary-color': '#37474F',
    '--secondary-color': '#90A4AE',
    '--background-color': '#263238',
    '--text-color': '#CFD8DC',
    '--primary-color-hover': 'rgba(84, 110, 122, 0.8)',
  },
  moss: {
    '--primary-color': '#556B2F',
    '--secondary-color': '#A4B48A',
    '--background-color': '#495638',
    '--text-color': '#E8F5E9',
    '--primary-color-hover': 'rgba(55, 71, 79, 0.8)',
  },
  sunset: {
    '--primary-color': '#BF360C',
    '--secondary-color': '#FFAB91',
    '--background-color': '#A61C00',
    '--text-color': '#FBE9E7',
    '--primary-color-hover': 'rgba(216, 67, 21, 0.8)',
  },
  lake: {
    '--primary-color': '#006064',
    '--secondary-color': '#80CBC4',
    '--background-color': '#004D40',
    '--text-color': '#E0F7FA',
    '--primary-color-hover': 'rgba(0, 131, 143, 0.8)',
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