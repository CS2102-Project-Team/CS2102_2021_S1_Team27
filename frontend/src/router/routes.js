import mainRoutes from './main-routes';

export default [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
  },
  {
    name: 'signup',
    path: '/signup',
    component: () => import('@/views/signup/index'),
  },
  {
    path: '/',
    component: () => import('@/views/layout/layout'),
    children: mainRoutes,
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
