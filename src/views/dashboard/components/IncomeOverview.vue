<script>
import { useTheme } from 'vuetify';
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import { useDashboardStore } from '@/stores/modules/dashboard/dashboard';
import { ref } from 'vue';

export default {
  name: 'DomainOverview',
  components: {
    UiTitleCard
  },
  data() {
    const theme = useTheme();
    const InfoColor = theme.current.value.colors.info;
    return {
      loadingAmountSites: ref(false),
      totalDomains: ref(0),
      InfoColor,
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
        colors: InfoColor,
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
    this.getDomainsAmountParam(); 
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async getDomainsAmountParam() {
      const store = useDashboardStore();
      this.loadingAmountSites = true;
      const ketqua = await store.fetchDomainsAmountParam();
      this.loadingAmountSites = false;
      // Build data
      // this.totalDomains = ketqua.totalSiteAll;
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user : null;
      const userRole = userData ? userData.roleId : 'unknown'; // ✅ Default to 'unknown' if missing


      // ✅ Update total domains
      this.totalDomains = ketqua.totalSiteAll;

      // ✅ If user is "seo-admin", show all teams data
      if (userRole === 'admin') {
        console.log("ketqua:", ketqua); // ✅ Debugging
        this.barChart1.series[0].data = [
          ketqua.totalSiteSEO1,
          // ketqua.totalSiteSEO2,
          ketqua.totalSiteSEO3,
          ketqua.totalSiteSEO4,
          ketqua.totalSiteDigital
        ];
      } 
      // ✅ If user belongs to a specific team, only show their data
      else {
        let userData = 0;
        switch (userRole) {
          case 'seo-1':
            this.totalDomains = userData = ketqua.totalSiteSEO1;
            this.barChart1.series[0].data = [userData, 0, 0, 0];
            break;
          // case 'seo-2':
          //   this.totalDomains = userData = ketqua.totalSiteSEO2;
          //   this.barChart1.series[0].data = [0, userData, 0, 0];
          //   break;
          case 'seo-3':
            this.totalDomains =  userData = ketqua.totalSiteSEO3;
            this.barChart1.series[0].data = [0, userData, 0, 0];
            break;
          case 'seo-4':
            this.totalDomains = userData = ketqua.totalSiteSEO4;
            this.barChart1.series[0].data = [0, 0, userData, 0];
            break;
          case 'digital':
            this.totalDomains = userData = ketqua.totalSiteDigital;
            this.barChart1.series[0].data = [0, 0, 0, userData];
            break;
          default:
            console.warn("User role not recognized:", userRole);
            userData = 0; // Default to zero if role is unrecognized
        }
        
        // ✅ Set chart data to only include the user's data
        
      }
    },
  }
};
</script>

<template>
  <UiTitleCard title="SITE" class-name="pt-5 px-0 rounded-md overflow-hidden">
    <!-- Loading Indicator -->
    <div v-if="loadingAmountSites" class="d-flex justify-center align-center mt-10">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      </div>    
    <div class="px-5" v-else>
      <h3 class="text-h3 mb-0">{{ 'Total: ' + totalDomains + ' sites'}}</h3>
    </div>
    <apexchart type="bar" height="400" :options="chartOptions1" :series="barChart1.series"> </apexchart>
  </UiTitleCard>
</template>
