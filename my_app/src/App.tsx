import React, { createContext, useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Import from './Import';
import { ThemeProvider } from '@emotion/react';
import { Card, CardContent, CssBaseline, Paper, createTheme, useMediaQuery } from '@mui/material';
import GraphViewer from './GraphViewer';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const isMobile = useMediaQuery('(max-width: 600px)');
  const darkTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  })

  return (
    <div>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        { isMobile ? (
          <div> <AppContent /> </div>
        ) : (
          <div className='Browser'> <AppContent /> </div>
        )}
      </ThemeProvider>
    </div>
  );
}

function AppContent() {
  return (
    <div>
      <Card>
        <CardContent>
          <Import />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
