<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRedirectStore } from '@/stores/modules/redirect/redirect';
import moment from 'moment';
import { Loader2Icon, ReloadIcon } from 'vue-tabler-icons';
import { RedoOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'RedirectStep1',
  components: {
    //
  },
  data() {
    return {
      redirectStore: useRedirectStore,
      is301: true,
      serverIP:'',
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
    this.fetchData()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
    },
    isNameValid() {
      return this.validateDomain(this.editedItem.name) === true;
    },
    items(): Array<Record<string, any>> {
      const store = useRedirectStore();
      return store.domain;
    }
  },
  watch: {
    serverIP(newIP) {
      this.redirectStore.serverIP = newIP;
      this.redirectStore.isValidServerIP = this.validateIPAddress(newIP) === true;

    },
    isSSL(newValue, oldValue) {
      this.redirectStore.isSSL = newValue;
      // Additional actions on change can be added here
    },
    items: {
      handler(newItems) {
        this.redirectStore.domain = newItems;
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
    async fetchData() {
      this.loading = true;
      try {
        const redirectStore = useRedirectStore();
        await redirectStore.fetchDomain({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await redirectStore.domain;
        this.totalItems = await redirectStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    submitToCF() {
      // Xử lý dữ liệu form sau khi submit
      console.log('>>>>> submitToCF');
      alert('submitToCF');
    },
    reset() {
      console.log('>>>>> reset', this.editedItem);
      this.items.splice(0, this.items.length);
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    handlePageChange(newPage) {
      this.page = newPage;
      this.fetchData();
    },
    handleItemsPerPageChange(newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.page = 1;
      this.fetchData();
    },
    handleOnSearch() {
      this.page = 1;
      this.fetchData();
    },
    handleSortBy({ page, itemsPerPage, sortBy }) {
      if (sortBy.length === 0) return;
      this.sortBy = sortBy[0].key;
      this.sortDesc = (sortBy[0].order === 'desc') ? true : false;
      this.page = 1;
      this.fetchData();
    },
    handleClearSearch() {
      this.page = 1;
      this.fetchData();
    },
    validateIPAddress(value) {
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value) || 'Please enter a valid IP address (e.g., 54.243.100.131)';
    },
    validateDomain(value) {
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]*\.)?[a-zA-Z0-9][a-zA-Z0-9-_]*\.[a-zA-Z]{2,11}?$/;
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
  <v-container class="px-5" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="pb-0">
      <v-col class="pb-2" :style="{fontSize: '20px'}">
        Step 1: Choice redirect type
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="3" class="py-0">
        <v-select
          v-model="isSSL"
          label="Redirect Type"
          class="mt-3" 
          :items="['Wildcard Redirect', 'Dynamic Segment Redirect', 'Domains to domains Redirect']"
        />
      </v-col>
      <v-col cols="1" class="py-1">
        <v-checkbox
          v-model="is301"
          label="301"
          class="mt-3"
          disabled
        />
      </v-col>
      <v-col cols="3" class="py-0">
        <v-text-field 
          v-model="serverIP" 
          label="Domain redirect From" 
          placeholder="Enter redirect domain" 
          class="mt-3" 
          :rules="[validateDomain]"
        />
      </v-col>
    </v-row>
  </v-container>


</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
