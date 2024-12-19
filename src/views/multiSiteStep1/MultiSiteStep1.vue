<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useMutilSiteStore } from '@/stores/modules/mutilSite/mutilSite';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';

export default defineComponent({
  name: 'MultiSiteStep1',
  components: {
    //
  },
  data() {
    return {
      mutilSiteStore: useMutilSiteStore,
      serverIP: '',
      serverList: ref([]) as Ref<any[]>,
      isSSL: 'flexible',
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
    // this.fetchData();
  },
  created() {
    this.getServerList();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
    },
    isNameValid() {
      return this.validateDomain(this.editedItem.name) === true;
    },
    items(): Array<Record<string, any>> {
      const store = useMutilSiteStore();
      return store.domain;
    }
  },
  watch: {
    serverIP(newServerIP) {
      const store = useMutilSiteStore();
      store.serverIP = newServerIP;
      store.isServerIPValid = this.validateIPAddress(newServerIP) === true;
    },
    items: {
      handler(newItems) {
        const store = useMutilSiteStore();
        store.domain = newItems;
      },
      deep: true,
    },

    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  methods: {
    triggerFileInput() {
      const fileInput = this.$refs.fileInput as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    },
    handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input && input.files) {
        const file = input.files[0];
        console.log('Selected file:', file.name);
      }
    },
    async getServerList() {
      const store = useMutilSiteStore();
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
      const store = useMutilSiteStore();
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

    reset() {
      this.items.splice(0, this.items.length);
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    validateIPAddress(value) {
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/;
      const invalidIPs = [
        "0.0.0.0", "1.1.1.1", "127.0.0.1", "169.254.0.0", "192.0.2.0",
        "198.51.100.0", "203.0.113.0", "224.0.0.0", "255.255.255.255",
        "100.64.0.0", "240.0.0.0"
      ];

      if (!ipPattern.test(value)) {
        return 'Please enter a valid IP address (e.g., 54.243.100.131)';
      }

      if (invalidIPs.includes(value)) {
        return 'This IP address cannot be used.';
      }

      return true;
    },
    validateDomain(value) {
      const domainRegex = /^(?!:\/\/)(?!.*--)(?!.*\.\-)(?!^-)(?!.*-$)([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,11}$/;
      return domainRegex.test(value) || 'Please enter a valid domain name';
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    downloadFile() {
      const fileUrl = 'https://seo-admin.s3.ap-southeast-2.amazonaws.com/domains.txt';
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', 'target_domains.txt');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error downloading file:', error);
        });
    },
    async importDomains(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      try {
        const fileContent: string | unknown = await this.readFile(file);
        let domainList: string[] = [];

        if (typeof fileContent === 'string') {
          domainList = fileContent
            .split('\n')
            .map(domain => domain.trim())
            .filter(domain => domain);
        }

        // Kiểm tra nếu domainList không rỗng trước khi xử lý
        if (domainList.length > 0) {
          const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
          domainList.forEach(domainName => {
            const nameExists = this.items.some(item => item.name === domainName);
            if (!nameExists) {
              this.items.unshift({
                id: 0,
                name: domainName,
                createdAt: currentTime.toString(),
                updatedAt: currentTime.toString(),
              });
            }
          });
        }        
        event.target.value = null;
      } catch (error) {
        console.error('Error reading file:', error);
      }
    },
    readFile(file) {
      // Return a promise to read the file content
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target) {
            resolve(event.target.result);
          } else {
            reject(new Error("FileReader target is null"));
          }
        };
        reader.onerror = error => reject(error);
        reader.readAsText(file);
      });
    },
    save() {
      const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
      this.editedItem.createdAt = currentTime;
      this.editedItem.updatedAt = currentTime;
      const nameExists = this.items.some(item => item.name === this.editedItem.name);
      if (nameExists && this.editedIndex === -1) {
        this.close();
        return;
      }
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        this.items.unshift(this.editedItem)
      }
      this.close();
    },

  }
});

</script>
<template>
  <v-container class="px-5" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="pb-0">
      <v-col class="pb-2" :style="{ fontSize: '20px' }">
        Step 1: input domains to <span style="font-weight: bold; color: green;">create</span> website
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="3" class="py-0">
        <v-select
          v-model="serverIP"
          :items="serverList"
          label="Server IP cài WP"
          placeholder="Enter Server IP cài WP"
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
    <v-row>
      <v-col cols="auto">
        <v-btn size="small" :style="{ backgroundColor: '#FF5252', color: '#ffff' }" @click="reset">
          <ReloadIcon size="20" color="white" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" :style="{ backgroundColor: '#6A8DBA', color: '#ffff' }" @click="downloadFile">
          <DownloadIcon size="20" color="white" />
            Download sample file
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" :style="{ backgroundColor: '#CCAA4D', color: '#ffff' }" @click="triggerFileInput">
          <UploadIcon size="20" color="white" />
          Import domains
        </v-btn>
        <input type="file" ref="fileInput" @change="importDomains" style="display:none;" />
      </v-col>
      <v-col>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2 ml-1 mr-2" size="small" :style="{ backgroundColor: '#7DA77D', color: '#ffff' }" dark v-bind="props">
              <SquarePlusIcon size="20" color="white" />
              New domain
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.name" label="Name" density="comfortable"
                      :rules="[validateDomain]"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field disabled v-model="editedItem.createdAt" label="Created At"
                      density="comfortable"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field disabled v-model="editedItem.updatedAt" label="Updated At"
                      density="comfortable"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn :disabled="!isNameValid" color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>


  <v-data-table-server 
    :headers="headers" 
    :items="items" 
    item-value="id" 
    :items-per-page="itemsPerPage"
    :items-length="totalItems" 
    :page.sync="page" 
    height="200" 
    hover hide-default-footer 
    :loading="loading">
    <template v-slot:item.actions="{ item }" class="scrollable-table">
      <EditIcon size="18" color="orange" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <TrashIcon size="18" color="#FF5252" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />
    </template>
  </v-data-table-server>
</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
