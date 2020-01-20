import React from 'react'
import {BrowserRouter, Route, Switch/**, Link, Redirect*/} from 'react-router-dom'
import Login from './components/login/login'
import './App.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { userReducer } from './reducers/user'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Provider store = {createStore(userReducer,{isLoggedIn: false})}>
      {/* provider, redux provideing the store to all of the children */}
      {/* connect function only works if the provider at the top level */}
      {/* give create store the combined reducers or have one big reducer  */}
      {/* initial state is the object after the reducer */}
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component = {Login}  />
          <Route path="/dashboard" exact component = {Dashboard}  />
        </Switch>
      </BrowserRouter>
    </Provider>
    // react app rewired start script is important and missing 
  );
}

export default App
