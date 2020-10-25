export default [
  // - Dashboard
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
    component: () => import('@/views/profiles/index'),
  },
  {
    name: 'profile_edit',
    path: '/profile/edit',
    meta: { requireAuth: true },
    component: () => import('@/views/profiles/edit_profile'),
  },
  {
    name: 'add_card',
    path: '/profile/add_card',
    meta: { requireAuth: true },
    component: () => import('@/views/profiles/add_card'),
  },
  {
    name: 'petowner',
    path: '/petowner',
    meta: { requireAuth: true },
    redirect: '/po',
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
  {
    path: '/po/pets/add_pet',
    component: () => import('@/views/petowner/addpetpage'),
  },
];
