import React, { useState, useCallback } from 'react';
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
import CloseIcon from '@material-ui/icons/Close';
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
  iconButton: {
    color: theme.palette.common.white,
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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const classes = useStyles();

  const openNav = useCallback(() => setIsNavOpen(true), [setIsNavOpen]);
  const closeNav = useCallback(() => setIsNavOpen(false), [setIsNavOpen]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={openNav}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.titleStyle}>
            {title}
          </Typography>
          <Button onClick={logout} variant="contained">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isNavOpen} onClose={closeNav}>
        <div className={classes.drawerContainer}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.iconButton}
              onClick={closeNav}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          {ROUTES.map((routes, index) => (
            <React.Fragment key={routes.map(({ title }) => title).toString()}>
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
