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
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index'),
  },
]