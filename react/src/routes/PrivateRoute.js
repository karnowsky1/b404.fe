import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NavLayout from '../components/layout/NavLayout';
import { TOKEN_KEY, UUID_KEY } from '../constants/auth';
import axios from 'axios';
import { setIsLoggedIn } from '../actions/user';
import { Spin } from 'antd';

const PrivateRoute = ({component: Component, authed, location, setIsLoggedIn, ...rest}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const uuid = localStorage.getItem(UUID_KEY)
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
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);
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
        authed ? (
          <NavLayout path={location.pathname}>
            <Component {...props} />
          </NavLayout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default connect((state = {}) => ({ authed: state.isLoggedIn }),{ setIsLoggedIn })(PrivateRoute);

