import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import { PageRoute, MultiRoute, isPageRoute } from '../utils';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
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

export interface RouteLinkProps {
  route: PageRoute | MultiRoute;
  currentPath: string;
}

export const RouteLink: React.FC<RouteLinkProps> = ({ route, currentPath }) => {
  const classes = useStyles();

  if (isPageRoute(route)) {
    const { title, path, Icon } = route;
    return (
      <ListItem
        button
        className={classes.navLink}
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
        <ListItemText primary={title} />
      </ListItem>
    );
  } else {
    return <></>; // TODO Add nested route link
  }
};
