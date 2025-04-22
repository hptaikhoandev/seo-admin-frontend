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
      name: 'HDSD',
      path: '/huong-dan-su-dung',
      component: () => import('@/views/hdsd/HdsdPage.vue')
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
      name: 'AccountID Management',
      path: '/account-id-management',
      component: () => import('@/views/accountID/AccountIDPage.vue')
    },
    {
      name: 'Pem Management',
      path: '/pem-management',
      component: () => import('@/views/pem/PemPage.vue')
    },
    {
      name: 'Server Management',
      path: '/server-management',
      component: () => import('@/views/server/ServerPage.vue')
    },
    {
      name: 'Sub Domain History',
      path: '/sub-domain-management',
      component: () => import('@/views/subdomain/SubDomainPage.vue')
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
      name: 'Migrate Site',
      path: '/migrate-site',
      component: () => import('@/views/migratesite/Migratesite.vue')
    },
    {
      name: 'Create WP Sites',
      path: '/tao-multi-wp-site',
      component: () => import('@/views/multiSite/MultiSite.vue')
    },
    {
      name: 'Delete WP Sites',
      path: '/destroy-wp-site',
      component: () => import('@/views/destroySite/DestroySite.vue')
    },
    {
      name: 'User Profile',
      path: '/user-profile',
      component: () => import('@/views/profile/Profile.vue')
    },
    {
      name: 'Terminal Command',
      path: '/command-domain',
      component: () => import('@/views/terminal/Terminal.vue')
    },
  ]
};

export default MainRoutes;
