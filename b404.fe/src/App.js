import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Login from './components/login/login';
import './App.css';
import Dashboard from './components/layout/dashboard/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Login /> 
    </BrowserRouter>
  );
}

export default App;
