<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useTerminalStore } from '@/stores/modules/terminal/terminal';
import {jwtDecode} from 'jwt-decode';

export default defineComponent({
  name: 'TerminalHeader',
  components: {
    //
  },
  data() {
    return {
      choicedServers: [] as any[],
      serverList: [] as any[],
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
      loading: ref(false),
      loadingAmountSites: ref(false),
      totalSites: ref(0),
      maxSelection: 10,
    };
  },

  mounted() {
    const store = useTerminalStore();
    store.choicedServers = [];
  },
  created() {
    this.getServerList();
  },
  computed: {
  },
  watch: {
    choicedServers(newServerIPs) {
      const store = useTerminalStore();
      store.choicedServers = newServerIPs;
    },
  },
  methods: {
    async getServerList() {
      const store = useTerminalStore();
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return [];
      const parsedUser = JSON.parse(storedUser);
      if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
      const user = jwtDecode(parsedUser.user.token);
      const userRole = (user as any).roleId;
      if (!(user && userRole)) return [];
      const ketqua = await store.fetchServerList(userRole);
      this.serverList = ketqua.map((item: any) => ({ team: item.team, id: item.id, value: item.server_ip }));
    },
    updateSelectedServers(newServerIPs: any[]) {
      if (newServerIPs.length <= this.maxSelection) {
        this.choicedServers = newServerIPs;
      } else {
        alert(`Chỉ được chọn tối đa ${this.maxSelection} servers.`);
      }
    }
  }
});

</script>
<template>
  <v-container class="px-5" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="pb-0">
      <v-col class="pb-2" :style="{fontSize: '20px'}">
        Step 1: input ServerIP
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="4" class="py-0">
        <v-combobox
          v-model="choicedServers"
          :items="serverList"
          label="Server IP"
          placeholder="Select or Search Server IP"
          class="mt-3"
          @update:modelValue="updateSelectedServers"
          multiple
          clearable
          chips
          deletable-chips
          return-object
          item-title="value"
          item-value="value"
        ></v-combobox>
      </v-col>
      <v-col cols="2" class="d-flex align-center" v-if="loadingAmountSites">
        <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
      </v-col>
     
    </v-row>
  </v-container>
</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
