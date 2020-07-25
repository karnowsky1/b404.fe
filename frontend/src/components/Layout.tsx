import React, { useState } from 'react';
import {
  Drawer,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  List,
  Divider,
  Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { connect, ConnectedProps } from 'react-redux';

import { ROUTES, isPageRoute } from '../utils';
import { RouteLink } from './RouteLink';
import { logout as logoutAction } from '../actions';

const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    background: theme.palette.secondary.main,
    width: 250,
    height: '100%',
    color: theme.palette.secondary.contrastText,
  },
  titleStyle: {
    flexGrow: 1,
  },
}));

const connector = connect(undefined, {
  logout: logoutAction,
});

export interface LayoutProps extends ConnectedProps<typeof connector> {
  title: string;
  currentPath: string;
  children: JSX.Element; // Not sure why, but there is an error without this
}

const LayoutComponent: React.FC<LayoutProps> = ({
  title,
  currentPath,
  children,
  logout,
}) => {
  const [openNav, setOpenNav] = useState(false);

  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon onClick={() => setOpenNav(true)} />
          </IconButton>
          <Typography variant="h6" className={classes.titleStyle}>
            {title}
          </Typography>
          <Button onClick={logout} variant="contained">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={openNav} onClose={() => setOpenNav(false)}>
        <div className={classes.drawerContainer}>
          {ROUTES.map((routes, index) => (
            <React.Fragment key={routes.toString()}>
              <List>
                {routes
                  .filter((route) => !isPageRoute(route) || !route.hide)
                  .map((route) => (
                    <RouteLink
                      key={route.title}
                      route={route}
                      currentPath={currentPath}
                    />
                  ))}
              </List>
              {index < ROUTES.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Drawer>
      {children}
    </>
  );
};

export const Layout = connector(LayoutComponent);
