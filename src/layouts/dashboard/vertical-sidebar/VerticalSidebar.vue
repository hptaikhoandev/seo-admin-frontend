<script setup lang="ts">
import { shallowRef, onMounted } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import ExtraBox from './extrabox/ExtraBox.vue';
import Logo from '../logo/LogoDark.vue';
import { jwtDecode } from 'jwt-decode';

const customizer = useCustomizerStore();
let sidebarMenu = shallowRef(sidebarItems);
onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return [];
  const parsedUser = JSON.parse(storedUser);
  if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
  const user = jwtDecode(parsedUser.user.token);
  const userRole = (user as any).roleId;
  if (!(user && userRole)) return [];
  switch (true) {
    case ['admin'].includes(userRole):
      sidebarMenu = [
          { header: 'Quản lý chung' },
          { title: '📒 Hướng dẫn sử dụng', to: '/huong-dan-su-dung' },
          { title: '🌸 Dashboard', to: '/dashboard' },
          { title: '🤵 User Management', to: '/user-management' },
          { title: '🍷 AccountID Management', to: '/account-id-management' },
          { title: '☕ Pem File Management', to: '/pem-management' },
          { title: '🍯 Server Management', to: '/server-management' },
      ] as any;
      break;
    case ['seo-1', 'seo-2', 'seo-3', 'seo-4', 'seo-5', 'seo-6', 'digital'].includes(userRole):
      sidebarMenu = [
        { header: 'Quản lý chung' },
        { title: '📒 Hướng dẫn sử dụng', to: '/huong-dan-su-dung' },
        { title: '🌸 Dashboard', to: '/dashboard' },
        { title: '🍯 Server Management', to: '/server-management' },
        { header: 'Chức năng' },
        { title: '☘️ Add domains vào CF', to: '/them-domains-vao-cf' },
        { title: '🪵 Redirect Domain', to: '/redirect-domain' },
        { title: '🌷 Clone WP Site', to: '/clone-site' },
        { title: '💐 Create WP Sites', to: '/tao-multi-wp-site' },
        { title: '🌺 Delete WP Sites', to: '/destroy-wp-site' },
      ] as any;
      break;
  }
});
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="60"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <div class="pa-5">
      <Logo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list aria-busy="true" aria-label="menu list">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="false" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="false" />
          <!---Single Item-->
          <NavItem :item="item" v-else />
          <!---End Single Item-->
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
