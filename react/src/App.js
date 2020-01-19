import React from 'react'
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom'
import Login from './components/login/login'
import './App.css'
import { Provider } from 'react-redux'
import createStore from 'antd/lib/table/createStore'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb){
    this.isAuthenticated = false 
    setTimeout(cb, 100)
  }
}

function App() {
  return (
    <Provider store = {createStore({})}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component = {Login}  /> 
        </Switch>
      </BrowserRouter>
    </Provider>
    // react app rewired start script is important and missing 
  );
}

export default App
