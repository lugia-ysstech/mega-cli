import { Redirect } from '@lugia/lugiax-router/target/lib';
import React from 'react';
import routingConfig from './routing.config';

const getRouter = (routingConfig, routes) => {
  const rout = routes || {};
  routingConfig.forEach(item => {
    const { component, value, path } = item;
    if (component) {
      rout[value] = {
        exact: true,
        component,
      };
    } else if (path) {
      rout[value] = {
        exact: true,
        render: () => import(`${path}`),
      };
    } else {
      const { children } = item;
      if (children) {
        return getRouter(children, rout);
      }
    }
  });
  return rout;
};
export default {
  '/': {
    exact: true,
    render: async () => {
      return () => (
        <Redirect
          to={{
            pathname: '/analyse',
          }}
        />
      );
    },
  },
  ...getRouter(routingConfig),
  '/404': {
    exact: true,
    render: async () => import('./components/404'),
  },
  NotFound: {
    isHidden: true,
    render: async () => {
      return () => (
        <Redirect
          to={{
            pathname: '/404',
          }}
        />
      );
    },
  },
};
