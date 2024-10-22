<template>
  <div class="logo">
    <RouterLink to="/dashboard" aria-label="logo">
      <img :src=logo width="200" alt="Spam data" />

    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import logo from '@/assets/images/logo.png';
const primary = ref('rgb(var(--v-theme-primary))');
const darkprimary = ref('rgb(var(--v-theme-darkprimary))');
</script>
