import React, { createContext, useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Import from './Import';
import { ThemeProvider } from '@emotion/react';
import { Card, CardContent, CssBaseline, Paper, createTheme, useMediaQuery } from '@mui/material';
import GraphViewer from './GraphViewer';
import { IsMobileContext } from './Base'
import { BrowserRouter, Router, Routes } from 'react-router-dom';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const isMobile = useMediaQuery('(max-width: 600px)')
  const darkTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  })

  return (
    <IsMobileContext.Provider value={isMobile}>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {/* <Import /> */}
        <GraphViewer />
      </ThemeProvider>
    </IsMobileContext.Provider>
  )

  function AppA() {
    return (
      <BrowserRouter>
        <Routes>
          <Router path='' />
          <Router path='/about' element={<GraphViewer />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App
