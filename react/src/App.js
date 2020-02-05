import React from 'react'
// import {BrowserRouter, Route, Switch/**, Link, Redirect*/} from 'react-router-dom'
// import Login from './components/login/login'
import './App.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { userReducer } from './reducers/user'
// import Dashboard from './pages/Dashboard'
import Routes from './routes/Routes'

function App() {
  return (
    <Provider store = {createStore(userReducer,{isLoggedIn: false},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )}>
      {/* provider, redux provideing the store to all of the children */
       /* connect function only works if the provider at the top level */
       /* give create store the combined reducers or have one big reducer */
       /* initial state is the object after the reducer */}
      <Routes />
    </Provider>
    // react app rewired start script is important and missing 
  );
}

export default App
