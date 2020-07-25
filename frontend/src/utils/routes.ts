import { SvgIconComponent } from '@material-ui/icons';

import { AccessLevel } from './accessLevels';

export interface Route {
  title: string;
  Icon: SvgIconComponent;
  accessLevel: AccessLevel;
}

export interface PageRoute extends Route {
  path: string;
  Page: React.FC;
  hide?: boolean;
  noLayout?: boolean;
  unprotected?: boolean;
}

export interface MultiRoute extends Route {
  children: PageRoute[];
}

export const isPageRoute = (
  route: PageRoute | MultiRoute
): route is PageRoute => typeof (route as any).path === 'string';
