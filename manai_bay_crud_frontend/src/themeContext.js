import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const stored = window.localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  };
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });
  };

  // Also persist theme if changed by other means
  React.useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const activeTheme = useMemo(() => (theme === 'light' ? createTheme(lightTheme) : createTheme(darkTheme)), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);