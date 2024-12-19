<script>
import { useTheme } from 'vuetify';
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import { useDashboardStore } from '@/stores/modules/dashboard/dashboard';
import { ref } from 'vue';

export default {
  name: 'CPUOverview',
  components: {
    UiTitleCard
  },
  data() {
    const theme = useTheme();
    const WarningColor = theme.current.value.colors.warning;
    return {
      loadingAmountCPUs: ref(false),
      totalCPUs: ref(0),
      WarningColor,
      chartOptions1: {
        chart: {
          type: 'bar',
          height: 100,
          fontFamily: `inherit`,
          foreColor: '#a1aab2',
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '45%',
            borderRadius: 4
          }
        },
        labels: ['SEO-1', 'SEO-2', 'SEO-3', 'SEO-4'],
        colors: WarningColor,
        stroke: {
          curve: 'smooth'
        },
        fill: {
          opacity: 0.6
        },
        xaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          show: false
        },
        grid: {
          show: false
        },
        tooltip: {
          fixed: {
            enabled: false
          }
        }
      },
      barChart1: {
        series: [
          {
            name: 'vcpu',
            data: [0, 0, 0, 0]
          }
        ]
      }
    };
  },
  mounted() {
    //
  },
  created() {
    this.getCPUsAmountParam(); 
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async getCPUsAmountParam() {
      const store = useDashboardStore();
      this.loadingAmountCPUs = true;
      const ketqua = await store.fetchCPUsAmountParam();
      this.loadingAmountCPUs = false;
      // Build data
      this.totalCPUs = ketqua.totalCPUAll;
      this.barChart1.series[0].data = [ketqua.totalCPUSEO1, ketqua.totalCPUSEO2, ketqua.totalCPUSEO3, ketqua.totalCPUSEO4];
    },
  }
};
</script>

<template>
  <UiTitleCard title="CPU" class-name="pt-5 px-0 rounded-md overflow-hidden">
    <!-- Loading Indicator -->
    <div v-if="loadingAmountCPUs" class="d-flex justify-center align-center mt-10">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      </div>    
    <div class="px-5" v-else>
      <h3 class="text-h3 mb-0">{{ 'Total: ' + totalCPUs + ' vCPU'}}</h3>
    </div>
    <apexchart type="bar" height="400" :options="chartOptions1" :series="barChart1.series"> </apexchart>
  </UiTitleCard>
</template>
