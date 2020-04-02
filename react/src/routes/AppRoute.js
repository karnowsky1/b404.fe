import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NavLayout from '../components/layout/NavLayout';
import { TOKEN_KEY, UUID_KEY } from '../constants/auth';
import axios from 'axios';
import { setIsLoggedIn, setUser } from '../actions/user';
import { Spin } from 'antd';

const AppRoute = ({
  component: Component,
  authed,
  user,
  location,
  setIsLoggedIn,
  setUser,
  requireAdmin,
  isPrivate = false,
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  // make an requireAdmin or isAdmin prop
  // add requireAdmin, isAdmin, into the props

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const uuid = localStorage.getItem(UUID_KEY);
    // checking the JWT token against the authorization header
    if (token && uuid) {
      axios
        .get(window.__env__.API_URL + `/blink/api/person/id/${uuid}`, {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          if (response.status === 200) {
            setIsLoggedIn(true);
            setUser(response.data);
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setIsLoggedIn, setUser]);
  // runs when it mounts or when a dependancy changes
  return loading ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Spin size="large" />
    </div>
  ) : (
    <Route
      {...rest}
      render={props =>
        !authed && isPrivate ? (
          <Redirect to={process.env.PUBLIC_URL + '/login'} />
        ) : // ) : (!isPrivate && authed) ? (
        (!isPrivate && authed) ||
          (user && user.accessLevelID > 1 && requireAdmin && authed) ? (
          //evaluated every render
          // undefined for the first few renders, then it renders with the actual user object
          // trying to incorporate authorization rendering
          <Redirect to={process.env.PUBLIC_URL + '/dashboard'} />
        ) : isPrivate ? (
          <NavLayout path={process.env.PUBLIC_URL + location.pathname}>
            <Component {...props} />
          </NavLayout>
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default connect(
  (state = {}) => ({ user: state.user, authed: state.isLoggedIn }),
  { setUser, setIsLoggedIn }
)(AppRoute);
