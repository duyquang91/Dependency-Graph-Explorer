import './App.css';
import Import from './Import';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline, createTheme, useMediaQuery } from '@mui/material';
import GraphViewer from './GraphViewer';
import { IsDarkModeContext, IsMobileContext } from './Base'
import { HashRouter, Route, Routes } from 'react-router-dom';

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
      <IsDarkModeContext.Provider value={prefersDarkMode}>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Import />} />
              <Route path="/graphViewer/:index" element={<GraphViewer />} />
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </IsDarkModeContext.Provider>
    </IsMobileContext.Provider>
  )
}

export default App
