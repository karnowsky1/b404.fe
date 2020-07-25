import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { CustomRoute } from './components';
import { PAGE_ROUTES } from './utils';

export const App = () => {
  return (
    <Router>
      {PAGE_ROUTES.map((route) => (
        <CustomRoute key={route.title} route={route} />
      ))}
    </Router>
  );
};
