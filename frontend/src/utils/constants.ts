import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';

import { PageRoute, MultiRoute, isPageRoute } from './routes';
import { AccessLevel } from './accessLevels';
import { Dashboard, Milestones, Login } from '../pages';
import { flatten } from 'lodash';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
export const DEFAULT_PATH = '/dashboard';
export const LOGIN_PATH = '/login';
export const ROUTES: Array<Array<PageRoute | MultiRoute>> = [
  [
    {
      title: 'Dashboard',
      path: DEFAULT_PATH,
      Icon: DashboardIcon,
      Page: Dashboard,
      accessLevel: AccessLevel.Provider,
    },
    {
      title: 'Login',
      path: LOGIN_PATH,
      Icon: DescriptionIcon,
      Page: Login,
      hide: true,
      noLayout: true,
      unprotected: true,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Milestones',
      path: '/milestones',
      Icon: DescriptionIcon,
      Page: Dashboard,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Workflow',
      path: '/workflow',
      Icon: EditIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Documents',
      path: '/documents',
      Icon: EditIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Customer,
    },
  ],
  [
    {
      title: 'Main Settings',
      path: '/main-settings',
      Icon: SettingsIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Provider,
    },
    {
      title: 'Admin',
      Icon: DashboardIcon,
      accessLevel: AccessLevel.Admin,
      children: [
        {
          title: 'Company',
          path: '/company',
          Icon: EditIcon,
          Page: Milestones,
          accessLevel: AccessLevel.Admin,
        },
        {
          title: 'People',
          path: '/people',
          Icon: EditIcon,
          Page: Milestones,
          accessLevel: AccessLevel.Admin,
        },
      ],
    },
  ],
];
export const PAGE_ROUTES = flatten(ROUTES).reduce<Array<PageRoute>>(
  (routes, route) => {
    if (isPageRoute(route)) {
      return [...routes, route];
    }
    return [...routes, ...route.children];
  },
  []
);
