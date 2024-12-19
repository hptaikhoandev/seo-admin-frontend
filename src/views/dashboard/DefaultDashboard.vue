<script setup lang="ts">
import WidgetFive from './components/WidgetFive.vue';
import UniqueVisitor from './components/UniqueVisitor.vue';
import IncomeOverview from './components/IncomeOverview.vue';
import CPUOverview from './components/CPUOverview.vue';
import RAMOverview from './components/RAMOverview.vue';
import RecentOrder from './components/RecentOrder.vue';
import AnalyticsReport from './components/AnalyticsReport.vue';
import HelpSupport from './components/HelpSupport.vue';
import TransactionHistory from './components/TransactionHistory.vue';
import SalesReport from './components/SalesReport.vue';
</script>
<template>
  <!-- -------------------------------------------------------------------- -->
  <!-- Total widgets -->
  <!-- -------------------------------------------------------------------- -->
  <WidgetFive />

  <v-row class="mb-0 justify-center">
    <!-- -------------------------------------------------------------------- -->
    <!-- Unique visitor -->
    <!-- -------------------------------------------------------------------- -->
    <!-- <v-col cols="12" md="8">
      <UniqueVisitor />
    </v-col> -->

    <!-- -------------------------------------------------------------------- -->
    <!-- Income overview -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="6">
      <IncomeOverview />
    </v-col>
    <v-col cols="12" md="3">
      <CPUOverview />
    </v-col>
    <v-col cols="12" md="3">
      <RAMOverview />
    </v-col>
  </v-row>
</template>
