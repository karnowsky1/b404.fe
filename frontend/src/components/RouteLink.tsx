import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  multiLink: {
    padding: 0,
  },
  accordion: {
    flexGrow: 1,
    background: 'none',
    boxShadow: 'none',
  },
  iconContainer: {
    minWidth: 56,
    color: theme.palette.secondary.contrastText,
  },
  listRoot: {
    padding: 0,
    width: '100%',
  },
  summaryRoot: {
    lineHeight: 0,
    '&$expanded': {
      minHeight: 48,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  details: {
    padding: '0px 16px 16px',
  },
  expanded: {},
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
        {Icon && (
          <ListItemIcon className={classes.iconStyle}>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText primary={title} />
      </ListItem>
    );
  } else {
    const { title, Icon, children } = route;
    return (
      <ListItem
        classes={{
          root: classes.multiLink,
        }}
      >
        <Accordion
          classes={{ root: classes.accordion }}
          defaultExpanded={children.some(({ path }) => currentPath === path)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={classes.navLink} />}
            classes={{
              root: classes.summaryRoot,
              content: classes.content,
              expanded: classes.expanded,
            }}
          >
            {Icon && (
              <div className={classes.iconContainer}>
                <Icon />
              </div>
            )}
            <Typography className={classes.navLink}>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.details }}>
            <List classes={{ root: classes.listRoot }}>
              {children.map((child) => (
                <RouteLink
                  key={child.title}
                  route={child}
                  currentPath={currentPath}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </ListItem>
    );
  }
};
