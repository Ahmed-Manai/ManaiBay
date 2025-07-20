import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const activeTheme = useMemo(() => (theme === 'light' ? createTheme(lightTheme) : createTheme(darkTheme)), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);