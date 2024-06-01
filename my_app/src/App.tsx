import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material' 

function App() {
  const list = ['steve']
  return (
    <div className="App">
      <Button 
        variant="outlined" 
        onClick={() => {alert('Hi')}}>
          Click
      </Button>
    </div>
  );
}

export default App;
