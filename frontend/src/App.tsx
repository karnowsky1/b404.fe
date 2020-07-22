import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Home, Login, Milestones } from './pages';
import { LOGIN_ROUTE, MAIN_ROUTES } from './utils/constants';

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path={LOGIN_ROUTE}>
          <Login />
        </Route>
        <Route path={MAIN_ROUTES.dashboard.path}>
          <Home />
        </Route>
        <Route path={MAIN_ROUTES.milestones.path}>
          <Milestones />
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
};
