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
export const DASHBOARD_PATH = '/dashboard';
export const LOGIN_PATH = '/login';
export const DOCUMENTS_PATH = '/documents';
export const WORKFLOWS_PATH = '/workflows';
export const SIGNATURES_PATH = '/signatures';
export const MAIN_SETTINGS_PATH = '/main-settings';
export const COMPANY_PATH = '/company';
export const PEOPLE_PATH = '/people';
export const DEFAULT_PATH = DASHBOARD_PATH;
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
      path: DASHBOARD_PATH,
      Icon: DashboardIcon,
      Page: Dashboard,
      accessLevel: AccessLevel.Provider,
    },
    {
      title: 'Documents',
      path: DOCUMENTS_PATH,
      Icon: DescriptionOutlinedIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Workflows',
      path: WORKFLOWS_PATH,
      Icon: AssignmentIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Customer,
    },
    {
      title: 'Signatures',
      path: SIGNATURES_PATH,
      Icon: EditOutlinedIcon,
      Page: Milestones,
      accessLevel: AccessLevel.Customer,
    },
  ],
  [
    {
      title: 'Main Settings',
      path: MAIN_SETTINGS_PATH,
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
          path: COMPANY_PATH,
          Page: Milestones,
          accessLevel: AccessLevel.Admin,
        },
        {
          title: 'People',
          path: PEOPLE_PATH,
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
