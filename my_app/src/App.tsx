import React, { createContext, useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Import from './Import';
import { ThemeProvider } from '@emotion/react';
import { Card, CardContent, CssBaseline, Paper, createTheme, useMediaQuery } from '@mui/material';
import GraphViewer from './GraphViewer';
import { IsMobileContext } from './Base'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Import />} />
            <Route path="/graphViewer/:index" element={<GraphViewer />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </IsMobileContext.Provider>
  )
}

export default App
