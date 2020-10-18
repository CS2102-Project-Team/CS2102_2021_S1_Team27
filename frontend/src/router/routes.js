import mainRoutes from './main-routes';
import beforeLogIn from './beforeLogIn';

export default [
  {
    path: '/profile',
    component: () => import('@/views/layout/layout'),
    children: mainRoutes,
  },
  {
    path: '/',
    component: () => import('@/views/layout/beforeLogInlayout'),
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
