<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useDomainStore } from '@/stores/modules/domain/domain';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';

export default defineComponent({
  name: 'Step1',
  components: {
    //
  },
  data() {
    return {
      domainStore: useDomainStore,
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
      const store = useDomainStore();
      return store.domain;
    }
  },
  watch: {

    serverIP(newServerIP) {
      const store = useDomainStore();
      store.serverIP = newServerIP;
      store.isServerIPValid = this.validateIPAddress(newServerIP) === true;
    },
    items: {
      handler(newItems) {
        const store = useDomainStore();
        store.domain = newItems;
      },
      deep: true,
    },
    isSSL(newValue, oldValue) {
      this.domainStore.isSSL = newValue;
      // Additional actions on change can be added here
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  methods: {
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
      const fileUrl = '/src/template/domains.txt';
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'domains.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async importDomains(event) {
      // Access the file uploaded
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      try {
        const fileContent = await this.readFile(file);
        const domainList = fileContent.split('\n').map(domain => domain.trim()).filter(domain => domain);
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
        event.target.value = null;
      } catch (error) {
        console.error('Error reading file:', error);
      }
    },
    readFile(file) {
      // Return a promise to read the file content
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
      });
    },
    async getServerList() {
      const store = useDomainStore();
      const user = ref(null);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.user && parsedUser.user.token) {
          user.value = jwtDecode(parsedUser.user.token);
        }
      }
      const ketqua = await store.fetchServerList(user.value.roleId);
      this.serverList = ketqua.map(item => item.server_ip);
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
        Step 1: input domains
      </v-col>
    </v-row>
      <v-row class="py-0">
        <v-col cols="3">
        <v-select
            v-model="serverIP"
            :items="serverList"
            label="Server IP"
            placeholder="Enter Server IP"
            :rules="[validateIPAddress]"
          />
        </v-col>
      <v-col cols="2" class="py-0">
        <v-select v-model="isSSL" label="SSL Type" class="mt-3" :items="['flexible', 'full', 'strict']" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn :style="{ backgroundColor: '#FF5252', color: '#ffff' }" @click="reset">
          <ReloadIcon size="20" color="white" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn :style="{ backgroundColor: '#6A8DBA', color: '#ffff' }" @click="downloadFile">
          <DownloadIcon size="20" color="white" />
          Download sample file
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn :style="{ backgroundColor: '#CCAA4D', color: '#ffff' }" @click="$refs.fileInput.click()">
          <UploadIcon size="20" color="white" />
          Import domains
        </v-btn>
        <input type="file" ref="fileInput" @change="importDomains" style="display:none;" />
      </v-col>
      <v-col>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2 ml-1 mr-2" :style="{ backgroundColor: '#7DA77D', color: '#ffff' }" dark v-bind="props">
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


  <v-data-table-server :headers="headers" :items="items" item-value="id" :items-per-page="itemsPerPage"
    :items-length="totalItems" :page.sync="page" @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange" height="200" hover hide-default-footer :loading="loading"
    @update:options="handleSortBy">
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
