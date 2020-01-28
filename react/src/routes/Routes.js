import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from '../components/login/login'
import Dashboard from '../pages/Dashboard'
import Documents from '../pages/Documents';
import Workflow from '../pages/Workflow';
import Signatures from '../pages/Signatures';
import MainSettings from '../pages/MainSettings';
import Admin from '../pages/Admin';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component = {Login} />
          <Route path="/login" exact component = {Login} />
          {/* <Route path="/dashboard" exact component = {Dashboard} /> */}
          <PrivateRoute exact path="/dashboard" component={Dashboard} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/documents" component={Documents} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/workflow" component={Workflow} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/signatures" component={Signatures} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/main-settings" component={MainSettings} authed={this.props.isLoggedIn}/>
          <PrivateRoute exact path="/admin" component={Admin} authed={this.props.isLoggedIn}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

// const mapStateToProps = state => ({})

export default Routes;
// export default Routes
