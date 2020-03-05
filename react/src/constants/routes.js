export const MAIN_ROUTES = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Documents', path: '/documents', icon: 'form' },
  { name: 'Workflow', path: '/workflow', icon: 'snippets' },
  { name: 'Milestones', path: '/milestones', icon: 'radius-setting' },
  { name: 'Signatures', path: '/signatures', icon: 'edit' }
]

export const SETTINGS_ROUTES = [
  { name: 'Main Settings', path: '/main-settings', icon: '' },
  { name: 'Company', path: '/company', icon: '' },
  { name: 'People', path: '/people', icon: '' }
]

export const ROUTES = [...MAIN_ROUTES, ...SETTINGS_ROUTES]