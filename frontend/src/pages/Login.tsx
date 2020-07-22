import React, { useState, useCallback } from 'react';
import { Paper, TextField, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';

import { login as loginAction } from '../actions';
import { selectIsAuthenticated } from '../selectors';
import { State } from '../reducers';
import { Redirect } from 'react-router';
import { MAIN_ROUTES } from '../utils';

const useStyles = makeStyles({
  container: {
    margin: '20px auto',
    padding: 20,
    height: '50%',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const connector = connect(
  (state: State) => ({
    isAuthenticated: selectIsAuthenticated(state),
  }),
  {
    login: loginAction,
  }
);

export const LoginComponent: React.FC<ConnectedProps<typeof connector>> = ({
  login,
  isAuthenticated,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();
  const onSubmit = useCallback(
    (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      login(username, password);
    },
    [login, username, password]
  );
  return isAuthenticated ? (
    <Redirect to={MAIN_ROUTES.dashboard.path} />
  ) : (
    <Paper className={classes.container}>
      <Typography variant="h5">Login</Typography>
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="Password"
        />
        <Button type="submit" onClick={onSubmit}>
          Login
        </Button>
      </form>
    </Paper>
  );
};

export const Login = connector(LoginComponent);
