<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import { useMutilSiteStore } from '@/stores/modules/mutilSite/mutilSite';

export default defineComponent({
  name: 'MultiSiteStep2',
  components: {
    //
  },
  data() {
    return {
      mutilSiteStore: useMutilSiteStore(),
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('body'),
      sortDesc: ref(false),
      selected: ref([]),
      showResult: false,
      resultMessage: {
        success: 0,
        fail: {
          count:0,
          messages: []
        },
      },
      headers: [
        { title: 'NAME', key: 'name' },
        { title: 'NS', key: 'ns' },
        { title: 'STATUS', key: 'status' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        body: '',
        userId: 1,
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        body: '',
        userId: 1,
        createdAt: '',
        updatedAt: '',
      },
      items: ref([]) as Ref<any[]>,
      page: ref(1),
      itemsPerPage: ref(5),
      totalItems: ref(110),
      loading: ref(false),
    };
  },

  mounted() {
    // 
  },
  created() {
    //
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Message' : 'Edit Message'
    },
    showStept2(): boolean {
      const store = useMutilSiteStore();
      if (store.domain.length == 0) {
        this.items.splice(0, this.items.length);
        store.domain.splice(0, store.domain.length);
      }
      return (store.domain.length > 0) && (store.serverIP !== '' || store.isServerIPValid);
    },

  },
  watch: {

    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    async submitStep2() {
      this.close();
      this.loading = true;
      this.showResult = false;
      try {
        const serverIP = this.mutilSiteStore.serverIP;
        const domains = this.mutilSiteStore.domain.map(domain => domain.name);

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
        const user = jwtDecode(parsedUser.user.token);
        const userRole = (user as any).roleId;
        if (!(user && userRole)) return [];

        const requestData = {
          team: userRole,
          server_ip: serverIP,
          domains: domains,
        };

        const ketqua = await this.mutilSiteStore.addListDomainsToMultiSites(requestData);
        this.resultMessage = ketqua.result;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
        this.showResult = true;
      }

    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  }
});

</script>
<template>
  <v-toolbar flat v-if="showStept2">
    <v-toolbar-title>
      Step 2: submit to server
      <v-btn class="text-white mx-2" :style="{ backgroundColor: '#6A8DBA' }" @click="submitStep2" :disabled="loading">
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="20"
          class="mr-2"
        >
        </v-progress-circular>
        Submit
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
  <!-- Hiển thị kết quả chỉ sau khi gọi API xong (khi loading là false) -->
  <v-text v-if="showResult">
    <span class="text-success font-bold">Success: {{ resultMessage.success }}</span>
    <span v-if="resultMessage.fail.count !== 0" class="text-error font-bold">, Fail: {{ resultMessage.fail.count }}</span>
  </v-text>
  <v-text v-if="showResult && resultMessage.fail.count !== 0">
    <ul>
      <li v-for="(message, index) in resultMessage.fail.messages" :key="index" class="text-error font-bold">
        {{ message }}
      </li>
    </ul>
  </v-text>
</template>
<style>
/* .custom-spacing .v-label {
  margin-bottom: 25px;
} */
</style>
