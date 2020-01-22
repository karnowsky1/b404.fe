import React, { Component } from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

const PrivateRoute = ({component: Component, authed, ...rest}) => (
    <Route {...rest} render={props => (
        authed
            ? <Component {...props} />
            : <Redirect to="/login" />
    )} 
    />
)

export default PrivateRoute


