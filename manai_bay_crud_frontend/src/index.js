import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './routes';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import { CustomThemeProvider, useTheme } from './themeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ThemedApp = () => {
  const { activeTheme } = useTheme();
  return (
    <ThemeProvider theme={activeTheme}>
      <AppRoutes />
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
