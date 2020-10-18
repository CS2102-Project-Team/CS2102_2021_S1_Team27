export default [
  // - Dashboard
  {
    name: 'home',
    path: '/',
    meta: { requireAuth: true },
    component: () => import('@/views/home/index'),
  },
  {
    name: 'petowner',
    path: '/petowner',
    meta: { requireAuth: true },
    component: () => import('@/views/home/index'),
  },
  {
    name: 'caretaker',
    path: '/caretaker',
    meta: { requireAuth: true },
    component: () => import('@/views/home/index'),
  },
  {
    name: 'profile',
    path: '/profile',
    meta: { requireAuth: true },
    component: () => import('@/views/home/index'),
  },
];
