import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NavLayout from '../components/layout/NavLayout';
import { TOKEN_KEY, UUID_KEY } from '../constants/auth';
import axios from 'axios';
import { setIsLoggedIn } from '../actions/user';
import { Spin } from 'antd';

const AppRoute = ({component: Component, authed, location, setIsLoggedIn, isPrivate = false, ...rest}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const uuid = localStorage.getItem(UUID_KEY)
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
            setIsLoggedIn(true)
          }
        })
        .catch(e => {
          console.error(e)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [setIsLoggedIn]);
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
          <Redirect to="/login" />
        ) : !isPrivate && authed ? (
          <Redirect to="/dashboard" />
        ) : isPrivate ? (
        <NavLayout path={location.pathname}>
          <Component {...props} />
        </NavLayout>)
        : (
          <Component {...props} />
        )
      }
    />
  );
};

export default connect((state = {}) => ({ authed: state.isLoggedIn }),{ setIsLoggedIn })(AppRoute);

