import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Login from './components/login/login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Login /> 
    </BrowserRouter>
  );
}

export default App;
