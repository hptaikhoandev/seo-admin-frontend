<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useClonesiteStore } from '@/stores/modules/clonesite/clonesite';
import {jwtDecode} from 'jwt-decode';

export default defineComponent({
  name: 'ClonesiteStep1',
  components: {
    //
  },
  data() {
    return {
      serverIP: '',
      domainNameSource: '',
      domainNameTarget: '',
      serverList: ref([]) as Ref<any[]>,
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('vendor'),
      sortDesc: ref(false),
      headers: [
        { title: 'NAME', key: 'name' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        name: '',
        createdAt: '',
        updatedAt: '',
      },
      items: ref([]) as Ref<any[]>,
      page: ref(1),
      itemsPerPage: ref(5),
      totalItems: ref(110),
      loading: ref(false),
      loadingAmountSites: ref(false),
      totalSites: ref(0),
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
    serverIP(newServerIP) {
      const store = useClonesiteStore();
      store.serverIP = newServerIP;
      store.isServerIPValid = this.validateIPAddress(newServerIP) === true;
    },
    domainNameSource(newDomainNameSource) {
      const store = useClonesiteStore();
      store.domainNameSource = newDomainNameSource;
      store.isDomainNameSourceValid = this.validateDomain(newDomainNameSource) === true;
    },
    domainNameTarget(newDomainNameTarget) {
      const store = useClonesiteStore();
      store.domainNameTarget = newDomainNameTarget;
      store.isDomainNameTargetValid = this.validateDomain(newDomainNameTarget) === true;
    },
  
  },
  methods: {
    async getServerList() {
      const store = useClonesiteStore();
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return [];
      const parsedUser = JSON.parse(storedUser);
      if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
      const user = jwtDecode(parsedUser.user.token);
      const userRole = (user as any).roleId;
      if (!(user && userRole)) return [];
      const ketqua = await store.fetchServerList(userRole);
      this.serverList = ketqua.map(item => item.server_ip);
    },
    async onServerIPChange(newServerIP) {
      const store = useClonesiteStore();
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return [];
      const parsedUser = JSON.parse(storedUser);
      if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
      const user = jwtDecode(parsedUser.user.token);
      const userRole = (user as any).roleId;
      if (!(user && userRole)) return [];

      this.loadingAmountSites = true;
      if (!newServerIP) return;
      // Gọi hàm từ store với serverIP và team
      const ketqua = await store.fetchDomainAmount({team: userRole, server_ip: newServerIP});
      if (ketqua.status === 'success') {
        this.totalSites = ketqua.result.success;
      }
      this.loadingAmountSites = false;
    },
    validateIPAddress(value) {
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value) || 'Please enter a valid IP address (e.g., 54.243.100.131)';
    },
    validateDomain(value) {
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]*\.)?[a-zA-Z0-9][a-zA-Z0-9-_]*\.[a-zA-Z]{2,11}?$/;
      return domainRegex.test(value) || 'Please enter a valid domain name';
    },
  }
});

</script>
<template>
  <v-container class="px-5" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="pb-0">
      <v-col class="pb-2" :style="{fontSize: '20px'}">
        Step 1: input ServerIP, Domain
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="3" class="py-0">
        <v-select
          v-model="serverIP"
          :items="serverList"
          label="Server IP chứa website"
          placeholder="Select Server IP"
          class="mt-3"
          :rules="[validateIPAddress]"
          @update:modelValue="onServerIPChange"
        />
      </v-col>
      <v-col cols="2" class="d-flex align-center" v-if="loadingAmountSites">
        <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
      </v-col>
      <v-col cols="2" class="d-flex align-center" v-else>
        {{ "[ " + totalSites + " sites ]" }}
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="3" class="py-0">
        <v-text-field v-model="domainNameSource" label="Domain name source" placeholder="Enter Domain source" class="mt-3"
          :rules="[validateDomain]" />
      </v-col>
      <v-col cols="3" class="py-0">
        <v-text-field v-model="domainNameTarget" label="Domain name target" placeholder="Enter Domain target" class="mt-3"
          :rules="[validateDomain]" />
      </v-col>
    </v-row>
  </v-container>


</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
