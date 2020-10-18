import mainRoutes from './main-routes';
import beforeLogIn from './before-login';

export default [
  {
    path: '/profile',
    component: () => import('@/views/layout/layout'),
    children: mainRoutes,
  },
  {
    path: '/',
    component: () => import('@/views/layout/beforeLoginLayout'),
    children: beforeLogIn,
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index'),
  },
  {
    path: '*',
    redirect: '/404',
  },
];
