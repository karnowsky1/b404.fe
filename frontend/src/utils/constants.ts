import { AccessLevel } from './accessLevels';
import { SvgIconComponent } from '@material-ui/icons';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';

export interface Route {
  name: string;
  path: string;
  Icon: SvgIconComponent;
  accessLevel: AccessLevel;
}

export const LOGIN_ROUTE = '/login';
export const MAIN_ROUTES: Record<string, Route> = {
  dashboard: {
    name: 'Dashboard',
    path: '/dashboard',
    Icon: DashboardIcon,
    accessLevel: AccessLevel.Provider,
  },
  milestones: {
    name: 'Milestones',
    path: '/milestones',
    Icon: DescriptionIcon,
    accessLevel: AccessLevel.Customer,
  },
  workflow: {
    name: 'Workflow',
    path: '/workflow',
    Icon: EditIcon,
    accessLevel: AccessLevel.Customer,
  },
  documents: {
    name: 'Documents',
    path: '/documents',
    Icon: EditIcon,
    accessLevel: AccessLevel.Customer,
  },
};
export const SETTINGS_ROUTES: Record<string, Route> = {
  main: {
    name: 'Main Settings',
    path: '/main-settings',
    Icon: SettingsIcon,
    accessLevel: AccessLevel.Provider,
  },
  company: {
    name: 'Company',
    path: '/company',
    Icon: EditIcon,
    accessLevel: AccessLevel.Admin,
  },
  people: {
    name: 'People',
    path: '/people',
    Icon: EditIcon,
    accessLevel: AccessLevel.Admin,
  },
};
