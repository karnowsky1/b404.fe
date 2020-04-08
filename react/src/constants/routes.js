import { IS_EXTERNAL, IS_INTERNAL, IS_Provider } from './auth';

export const MAIN_ROUTES = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    auth: IS_Provider
  },
  {
    name: 'Milestones',
    path: '/milestones',
    icon: 'radius-setting',
    auth: IS_EXTERNAL
  },
  { name: 'Workflow', path: '/workflow', icon: 'snippets', auth: IS_INTERNAL },
  { name: 'Documents', path: '/documents', icon: 'form', auth: IS_EXTERNAL }
];

export const SETTINGS_ROUTES = [
  { name: 'Main Settings', path: '/main-settings', icon: '' },
  { name: 'Company', path: '/company', icon: '' },
  { name: 'People', path: '/people', icon: '' }
];

export const ROUTES = [...MAIN_ROUTES, ...SETTINGS_ROUTES];
