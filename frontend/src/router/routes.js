import mainRoutes from './main-routes';
import beforeLogIn from './before-login';

export default [
  {
    path: '/',
    component: () => import('@/views/layout/layout'),
    children: beforeLogIn.concat(mainRoutes),
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
