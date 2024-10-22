<template>
    <v-app>
      <Navbar @toggle-drawer="drawer = !drawer"></Navbar>
      <Sidebar v-model="drawer"></Sidebar>
      <v-main>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import Navbar from './NavBar.vue';
  import Sidebar from './SideBar.vue';
  
  export default {
    components: {
      Navbar,
      Sidebar
    },
    data: () => ({
      drawer: true
    })
  }
  </script>
  