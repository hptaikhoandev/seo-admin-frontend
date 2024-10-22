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
      name: 'Thêm domains vào CF',
      path: '/them-domains-vao-cf',
      component: () => import('@/views/domains/Domain.vue')
    },
    {
      name: 'Thay đổi Name Server',
      path: '/thay-doi-name-server',
      component: () => import('@/views/phones/Phone.vue')
    },
    {
      name: 'Redirect Domain',
      path: '/redirect-domain',
      component: () => import('@/views/users/UserPage.vue')
    },
    {
      name: 'Whiltelist IP',
      path: '/whiltelist-ip',
      component: () => import('@/views/emails/EmailPage.vue')
    },
    {
      name: 'Tạo Multi WP Site',
      path: '/tao-multi-wp-site',
      component: () => import('@/views/messages/Message.vue')
    },
  ]
};

export default MainRoutes;
