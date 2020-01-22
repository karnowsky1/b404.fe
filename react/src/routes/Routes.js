import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { setUser, setIsLoggedIn } from '../actions/user'
import { connect } from 'react-redux'
import Login from '../components/login/login'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component = {Login} />
          <Route path="/login" exact component = {Login} />
          {/* <Route path="/dashboard" exact component = {Dashboard} /> */}
          <PrivateRoute exact path="/dashboard" component={Dashboard} authed={this.props.isLoggedIn}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

// const mapStateToProps = state => ({})

export default connect((state={})=>({isLoggedIn: state.isLoggedIn}), {setIsLoggedIn})(Routes)
// export default Routes
