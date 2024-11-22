const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboard/DefaultDashboard.vue')
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/dashboard/DefaultDashboard.vue')
    },
    {
      name: 'User Management',
      path: '/user-management',
      component: () => import('@/views/users/UserPage.vue')
    },
    {
      name: 'Thêm domains vào CF',
      path: '/them-domains-vao-cf',
      component: () => import('@/views/domainToCF/DomainToCF.vue')
    },
    {
      name: 'Redirect Domain',
      path: '/redirect-domain',
      component: () => import('@/views/redirectToCF/RedirectToCF.vue')
    },
    {
      name: 'Clone Site',
      path: '/clone-site',
      component: () => import('@/views/clonesite/Clonesite.vue')
    },
    {
      name: 'Create Multi PBN WP Site',
      path: '/tao-multi-wp-site',
      component: () => import('@/views/multiSite/MultiSite.vue')
    },
  ]
};

export default MainRoutes;
