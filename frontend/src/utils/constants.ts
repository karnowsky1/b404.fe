import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

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
      title: 'Login',
      path: LOGIN_PATH,
      Page: Login,
      hide: true,
      noLayout: true,
      unprotected: true,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Dashboard',
      path: DEFAULT_PATH,
      Icon: DashboardIcon,
      Page: Dashboard,
      accessLevel: AccessLevel.Provider,
    },
    {
      title: 'Documents',
      path: '/documents',
      Icon: DescriptionOutlinedIcon,
      Page: Dashboard,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Workflows',
      path: '/workflows',
      Icon: AssignmentIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Signatures',
      path: '/signatures',
      Icon: EditOutlinedIcon,
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
      Icon: AddBoxIcon,
      accessLevel: AccessLevel.Admin,
      children: [
        {
          title: 'Company',
          path: '/company',
          Page: Milestones,
          accessLevel: AccessLevel.Admin,
        },
        {
          title: 'People',
          path: '/people',
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
