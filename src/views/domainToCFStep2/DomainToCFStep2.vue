<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useDomainStore } from '@/stores/modules/domain/domain';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';

export default defineComponent({
  name: 'DomainToCFStep2',
  components: {
    //
  },
  data() {
    return {
      domainStore: useDomainStore,
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
        { title: 'DOMAIN', key: 'domain' },
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
    // this.fetchData();
  },
  created() {
    // this.fetchData()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Message' : 'Edit Message'
    },
    showStept2(): boolean {
      const store = useDomainStore();
      if (store.domain.length == 0) {
        this.items.splice(0, this.items.length);
        store.domain.splice(0, store.domain.length);
      }
      return (store.domain.length > 0) && (store.serverIP !== '' || store.isServerIPValid);
    },
  },
  watch: {
    items: {
      handler(newItems) {
        const store = useDomainStore();
        store.domainExport = newItems;
        store.domainNS = newItems;
      },
      deep: true
    },
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
        const serverIP = this.domainStore.serverIP;
        const isSSL = this.domainStore.isSSL !== undefined ? this.domainStore.isSSL : 'flexible'; 
        const domainList = this.domainStore.domain?.map(domain => domain.name); 
        const user = ref(null);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.user && parsedUser.user.token) {
            user.value = jwtDecode(parsedUser.user.token);
          }
        }
        const requestData = {
          team: user.value.roleId,
          server_ip: serverIP,
          ssl_type: isSSL,
          domains: domainList
        };
        const domainStore = useDomainStore();
        const ketqua = await domainStore.addListDomainsToCloudflare(requestData);
        this.playAudio();
        this.resultMessage = ketqua.resultMessage;

        let dataResult = await domainStore.domainNS;
        const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
        dataResult = await dataResult.map(item => ({
          ...item,
          createdAt: currentTime,
          updatedAt: currentTime,
          status: 'Pending Nameserver Updates'
        }));

        this.items = await dataResult;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
        this.showResult = true;
      }
    },
    playAudio() {
      const audio = new Audio('/task_tao_website_success.mp3'); 
      audio.play().catch(err => console.error("Error playing audio:", err)); 
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
  <v-data-table-server
    v-if="showStept2"
    :headers="headers" 
    :items="items" 
    item-value="body" 
    :items-per-page="itemsPerPage"
    :items-length="totalItems" 
    :page.sync="page"
    hide-default-footer 
    hover 
    height="200"
    :loading="loading"
  >
    <template v-slot:top>
      <v-toolbar :style="{ height: 'auto', alignItems: 'center' }">
        <v-toolbar-title :style="{ height: 'auto', display: 'flex', alignItems: 'center' }">
          Step 2: submit to CloudFlare
          <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
              <v-btn class="text-white mx-2" :style="{ backgroundColor: '#6A8DBA' }" v-bind="props" :disabled="loading">
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
          </template>
          <v-card>
            <v-card-title class="text-h5 text-center">Xác nhận</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <span>Số lượng domain:   {{ domainStore.domain?.length }}</span>
                  </v-col>

                  <v-col cols="12">
                    <span>Server IP:   {{ domainStore.serverIP ? domainStore.serverIP : 'Vui lòng nhập server IP hợp lệ' }}</span>
                  </v-col>
                  <v-col cols="12">
                    <span>SSL Type: {{ domainStore.isSSL !== undefined ? domainStore.isSSL : 'flexible' }}</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
              <v-btn :disabled="!domainStore.serverIP" color="blue-darken-1" variant="text" @click="submitStep2">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
    </template>
  </v-data-table-server>
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
