<script>
import { useTheme } from 'vuetify';
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import { useDashboardStore } from '@/stores/modules/dashboard/dashboard';
import { ref } from 'vue';

export default {
  name: 'RAMOverview',
  components: {
    UiTitleCard
  },
  data() {
    const theme = useTheme();
    const PrimaryColor = theme.current.value.colors.primary;
    return {
      loadingAmountRams: ref(false),
      totalRAMs: ref(0),
      PrimaryColor,
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
        labels: ['SEO-1', 'SEO-3', 'SEO-4', 'Digital'],
        colors: PrimaryColor,
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
            name: 'sites',
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
    this.getRAMsAmountParam(); 
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async getRAMsAmountParam() {
      const store = useDashboardStore();
      this.loadingAmountRams = true;
      const ketqua = await store.fetchRAMsAmountParam();
      this.loadingAmountRams = false;
      // Build data
      this.totalRAMs = ketqua.totalRamAll;
      this.barChart1.series[0].data = [ketqua.totalRamSEO1, ketqua.totalRamSEO3, ketqua.totalRamSEO4, ketqua.totalRamDigital];
    },
  }
};
</script>

<template>
  <UiTitleCard title="RAM" class-name="pt-5 px-0 rounded-md overflow-hidden">
    <!-- Loading Indicator -->
    <div v-if="loadingAmountRams" class="d-flex justify-center align-center mt-10">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      </div>    
    <div class="px-5" v-else>
      <h3 class="text-h3 mb-0">{{ 'Total: ' + totalRAMs + ' GiB'}}</h3>
    </div>
    <apexchart type="bar" height="400" :options="chartOptions1" :series="barChart1.series"> </apexchart>
  </UiTitleCard>
</template>
