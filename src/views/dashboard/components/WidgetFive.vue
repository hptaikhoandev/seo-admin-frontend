<script lang="ts">
import { shallowRef, defineComponent, ref, type Ref } from 'vue';
import { useDashboardStore } from '@/stores/modules/dashboard/dashboard';
import { RiseOutlined, FallOutlined } from '@ant-design/icons-vue';
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
  name: 'WidgetFive',
  components: {
    //
  },
  data() {
    return {
      fivecards: shallowRef([
        
      ]),

    };
  },

  mounted() {
    //
  },
  created() {
    this.getServerList();
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async getServerList() {
      const store = useDashboardStore();
      const ketqua = await store.fetchServerList();
      const totalVPS = ketqua.length;
      const totalVPSSeo1 = ketqua.filter(item => item.team === 'seo-1').length;
      const totalVPSSeo2 = ketqua.filter(item => item.team === 'seo-2').length;
      const totalVPSSeo3 = ketqua.filter(item => item.team === 'seo-3').length;
      const totalVPSSeo4 = ketqua.filter(item => item.team === 'seo-4').length;

      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user : null;
      const userRole = userData ? userData.roleId : 'unknown';

      
      console.log("User role:", userRole); // ✅ Debugging
      // Build data
      if (userRole === 'admin') {
        this.fivecards = [
          {
            name: 'VPS của team SEO-1',
            earn: totalVPSSeo1,
            percent: `${((totalVPSSeo1 / totalVPS) * 100).toFixed(1)}%`,
            color: 'primary',
            icon: RiseOutlined,
          },
          {
            name: 'VPS của team SEO-2',
            earn: totalVPSSeo2,
            percent: `${((totalVPSSeo2 / totalVPS) * 100).toFixed(1)}%`,
            color: 'primary',
            icon: RiseOutlined,
          },
          {
            name: 'VPS của team SEO-3',
            earn: totalVPSSeo3,
            percent: `${((totalVPSSeo3 / totalVPS) * 100).toFixed(1)}%`,
            color: 'primary',
            icon: RiseOutlined,
          },
          {
            name: 'VPS của team SEO-4',
            earn: totalVPSSeo4,
            percent: `${((totalVPSSeo4 / totalVPS) * 100).toFixed(1)}%`,
            color: 'primary',
            icon: RiseOutlined,
          },
        ];
      } else {
        // ✅ If user is not "seo-admin", only show their team data
        const userTeamVPS = ketqua.filter(item => item.team === userRole).length;
        this.fivecards = [
          {
            name: `VPS của team ${userRole.toUpperCase()}`,
            earn: userTeamVPS,
            percent: `${((userTeamVPS / totalVPS) * 100).toFixed(1)}%`,
            color: 'primary',
            icon: RiseOutlined
          }
        ];
      }
    },

  }
});

</script>
<template>
  <v-row class="my-0">
    <v-col cols="12" sm="6" md="3" v-for="(card5, i) in fivecards" :key="i" :value="card5">
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-text>
            <div class="d-flex align-items-center justify-space-between">
              <div>
                <h6 class="text-h6 text-lightText mb-1">{{ card5.name }}</h6>
                <h4 class="text-h4 d-flex align-center mb-0">
                  {{ card5.earn }}
                  <v-chip :color="card5.color" :border="`${card5.color} solid thin opacity-50`" class="ml-2"
                    size="small" label>
                    <template v-slot:prepend>
                      <component :is="card5.icon" :style="{ fontSize: '12px' }" :class="'mr-1 text-' + card5.color" />
                    </template>
                    {{ card5.percent }}
                  </v-chip>
                </h4>
                <span class="text-lightText text-caption pt-5 d-block"><span
                    :class="'text-' + card5.color">{{
                    card5.text }}</span></span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
