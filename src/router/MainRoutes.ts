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
      name: 'Thay đổi Name Server',
      path: '/thay-doi-name-server',
      component: () => import('@/views/phones/Phone.vue')
    },
    {
      name: 'Redirect Domain',
      path: '/redirect-domain',
      component: () => import('@/views/redirectToCF/RedirectToCF.vue')
    },
    {
      name: 'Whiltelist IP',
      path: '/clone-site',
      component: () => import('@/views/clonesite/Clonesite.vue')
    },
    {
      name: 'Tạo Multi WP Site',
      path: '/tao-multi-wp-site',
      component: () => import('@/views/messages/Message.vue')
    },
  ]
};

export default MainRoutes;
