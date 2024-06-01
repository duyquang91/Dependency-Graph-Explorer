import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [text, setText] = useState(0)
  const User = createContext('')
  return (
    <div className="App">
      <input type='range' min={0} max={100} onChange={e => setText(e.target.valueAsNumber)} />
      <Form text={text}>Hi</Form>
    </div>
  );
}

function Form({ text }) {
  return (
    <div>
      <p> Hi {text} </p>
    </div>
  )
}

export default App;
