import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import {
  PageRoute,
  LOGIN_PATH,
  hasAccess,
  DEFAULT_PATH,
  AccessLevel,
} from '../utils';
import { Layout } from './Layout';
import { selectIsAuthenticated, selectUser } from '../selectors';
import { State } from '../reducers';
import { connect, ConnectedProps } from 'react-redux';

export interface RouteProps {
  route: PageRoute;
}

const connector = connect((state: State) => ({
  isAuthenticated: selectIsAuthenticated(state),
  user: selectUser(state),
}));

const CustomRouteComponent: React.FC<
  RouteProps & ConnectedProps<typeof connector>
> = ({ route, isAuthenticated, user }) => {
  const {
    path,
    title,
    Page,
    accessLevel,
    noLayout = false,
    unprotected = false,
  } = route;

  return (
    <Route
      path={path}
      render={({ location }) => {
        if (!unprotected && !isAuthenticated) {
          return <Redirect to={LOGIN_PATH} />;
        }
        if (
          !unprotected &&
          !hasAccess(accessLevel, user?.accessLevelID ?? AccessLevel.Provider)
        ) {
          return <Redirect to={DEFAULT_PATH} />;
        }
        return noLayout ? (
          <Page />
        ) : (
          <Layout title={title} currentPath={location.pathname}>
            <Page />
          </Layout>
        );
      }}
      exact
    />
  );
};

export const CustomRoute = connector(CustomRouteComponent);
