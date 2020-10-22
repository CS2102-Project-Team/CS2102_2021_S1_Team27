export default [
  // - Dashboard
  {
    name: 'caretaker',
    path: '/caretaker',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/index'),
  },
  {
    name: 'apply to be a care taker',
    path: '/caretaker/CTapply',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/CTapply'),
  },
  {
    name: 'view care taker schedule (current and upcoming orders)',
    path: '/caretaker/schedules',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/CTschedules'),
  },
  {
    name: 'view care taker completed orders',
    path: '/caretaker/orders',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/CTorders'),
  },
  {
    name: 'view and add part time care taker avaliability',
    path: '/caretaker/avbl',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/CTavbl'),
  },
  {
    name: 'view and add full time care taker leave',
    path: '/caretaker/leaves',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/CTleaves'),
  },
  {
    name: 'view care taker statistics',
    path: '/caretaker/stats',
    meta: { requireAuth: true },
    component: () => import('@/views/caretaker/CTstats'),
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
];
