import React, { useState } from 'react';
import {
  Drawer,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

import { MAIN_ROUTES, SETTINGS_ROUTES } from '../utils';

const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    background: theme.palette.secondary.main,
    width: 250,
    height: '100%',
    color: theme.palette.secondary.contrastText,
  },
  iconStyle: {
    color: 'inherit',
  },
  navLink: {
    color: theme.palette.secondary.contrastText,
  },
  navLinkActive: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.main,
  },
  settingsStyle: {
    paddingLeft: 10,
    opacity: 0.5,
  },
}));

export interface LayoutProps {
  title: string;
  currentPath: string;
}

export const Layout: React.FC<LayoutProps> = ({ title, currentPath }) => {
  const [openNav, setOpenNav] = useState(false);

  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon onClick={() => setOpenNav(true)} />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={openNav} onClose={() => setOpenNav(false)}>
        <div className={classes.drawerContainer}>
          <List>
            {Object.values(MAIN_ROUTES).map(({ name, path, Icon }) => (
              <ListItem
                button
                className={classes.navLink}
                key={name}
                component={Link}
                to={path}
                selected={path === currentPath}
                classes={{
                  selected: classes.navLinkActive,
                }}
              >
                <ListItemIcon className={classes.iconStyle}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <Typography className={classes.settingsStyle} variant="caption">
              Settings
            </Typography>
            {Object.values(SETTINGS_ROUTES).map(({ name, path, Icon }) => (
              <ListItem
                button
                className={classes.navLink}
                key={name}
                component={Link}
                to={path}
                selected={path === currentPath}
                classes={{
                  selected: classes.navLinkActive,
                }}
              >
                <ListItemIcon className={classes.iconStyle}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
};
