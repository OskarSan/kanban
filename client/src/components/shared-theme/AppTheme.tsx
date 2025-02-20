import React,{ ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light', // You can change this to 'dark' if you prefer a dark theme
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
};

const theme = createTheme(themeOptions);

interface AppThemeProps {
    children: ReactNode;
  }
  

const AppTheme: React.FC<AppThemeProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;