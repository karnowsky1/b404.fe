import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../components/login/login'
import Dashboard from '../pages/Dashboard'
import Documents from '../pages/Documents';
import Workflow from '../pages/Workflow';
import Signatures from '../pages/Signatures';
import MainSettings from '../pages/MainSettings';
import Admin from '../pages/Admin';
import AppRoute from './AppRoute'

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/* <Route path="/" exact component = {Login} />
          <Route path="/login" exact component = {Login} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/documents" component={Documents} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/workflow" component={Workflow} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/signatures" component={Signatures} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/main-settings" component={MainSettings} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/admin" component={Admin} authed={this.props.isLoggedIn}/> */}
          <AppRoute path="/" exact component = {Login} />
          <AppRoute path="/login" exact component = {Login} />
          <AppRoute exact path="/dashboard" component={Dashboard} authed={this.props.isLoggedIn} isPrivate/>
          <AppRoute exact path="/documents" component={Documents} authed={this.props.isLoggedIn} isPrivate/>
          <AppRoute exact path="/workflow" component={Workflow} authed={this.props.isLoggedIn} isPrivate/>
          <AppRoute exact path="/signatures" component={Signatures} authed={this.props.isLoggedIn} isPrivate/>
          <AppRoute exact path="/main-settings" component={MainSettings} authed={this.props.isLoggedIn} isPrivate/>
          <AppRoute exact path="/admin" component={Admin} authed={this.props.isLoggedIn} isPrivate/>
          <Redirect to="/dashboard"/>
        </Switch>
      </BrowserRouter>
    )
  }
}

// const mapStateToProps = state => ({})

export default Routes;
// export default Routes
