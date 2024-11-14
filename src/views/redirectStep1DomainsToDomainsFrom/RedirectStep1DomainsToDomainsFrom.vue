<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRedirectStore } from '@/stores/modules/redirect/redirect';
import moment from 'moment';

export default defineComponent({
  name: 'RedirectStep1DomainsToDomainsFrom',
  components: {
    //
  },
  data() {
    return {
      redirectStore: useRedirectStore,
      serverIP: '',
      isSSL: 'flexible',
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('vendor'),
      sortDesc: ref(false),
      headers: [
        { title: 'NAME', key: 'name' },
        { title: 'CREATED AT', key: 'createdAt' },
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
    //
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
    },
    isNameValid() {
      return this.validateDomain(this.editedItem.name) === true;
    },
  },
  watch: {
    items: {
      handler(newItems) {
        const store = useRedirectStore();
        store.domainRedirectFrom = newItems;
      },
      deep: true
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
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value) || 'Please enter a valid IP address (e.g., 54.243.100.131)';
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
      const fileUrl = '/src/template/source_domains.txt';
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'source_domains.txt');
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
            this.editedItem = {
              id: 0,
              name: domainName,
              createdAt: currentTime.toString(),
              updatedAt: currentTime.toString(),
            };
            this.items.unshift(this.editedItem);
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
  <v-container class="px-2 pb-1 pt-0 no-min-height" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="px-3">
      <v-col col="12" class="pb-2" :style="{ fontSize: '16px' }">
        Source Domains
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn size="small" :style="{ backgroundColor: '#FF5252', color: '#ffff' }" @click="reset">
          <ReloadIcon size="15" color="white" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" :style="{ backgroundColor: '#6A8DBA', color: '#ffff' }" @click="downloadFile">
          <DownloadIcon size="15" color="white" />
          Download sample file
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn size="small" :style="{ backgroundColor: '#CCAA4D', color: '#ffff' }" @click="$refs.fileInput.click()">
          <UploadIcon size="15" color="white" />
          Import domains
        </v-btn>
        <input type="file" ref="fileInput" @change="importDomains" style="display:none;" />
      </v-col>
      <v-col>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn size="small" class="mb-2 ml-1 mr-2" :style="{ backgroundColor: '#7DA77D', color: '#ffff' }" dark
              v-bind="props">
              <SquarePlusIcon size="15" color="white" />
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
    <v-data-table-server :headers="headers" :items="items" item-value="id" :items-per-page="itemsPerPage"
    :items-length="totalItems" :page.sync="page"
    height="200" hover hide-default-footer :loading="loading">
    <template v-slot:item.actions="{ item }" class="scrollable-table">
      <EditIcon size="18" color="orange" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <TrashIcon size="18" color="#FF5252" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />
    </template>
  </v-data-table-server>
  </v-container>
  
</template>

<style>
.v-field__input {
  margin-top: 10px;
}
.no-min-height {
  min-height: 100% !important;
}
</style>
