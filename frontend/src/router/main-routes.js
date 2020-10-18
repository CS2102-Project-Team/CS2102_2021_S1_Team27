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
    redirect: '/po',
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
    component: () => import('@/views/home/edit_profile'),
  },
  {
    path: '/po',
    component: () => import('@/views/petowner/index'),
  },
  {
    path: '/po/orders',
    component: () => import('@/views/petowner/orders'),
  },
  {
    path: '/po/pets',
    component: () => import('@/views/petowner/pets'),
  },
];
