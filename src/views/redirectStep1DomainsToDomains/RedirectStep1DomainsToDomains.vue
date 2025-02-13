<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRedirectStore } from '@/stores/modules/redirect/redirect';
import moment from 'moment';
import RedirectStep1DomainsToDomainsFrom from './../redirectStep1DomainsToDomainsFrom/RedirectStep1DomainsToDomainsFrom.vue';
import RedirectStep1DomainsToDomainsTo from './../redirectStep1DomainsToDomainsTo/RedirectStep1DomainsToDomainsTo.vue';
import RedirectStep1DomainsToDomainsDelete from './../redirectStep1DomainsToDomainsDelete/RedirectStep1DomainsToDomainsDelete.vue';


export default defineComponent({
  name: 'RedirectStep1DomainsToDomains',
  components: {
    RedirectStep1DomainsToDomainsFrom,
    RedirectStep1DomainsToDomainsTo,
    RedirectStep1DomainsToDomainsDelete,
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
    //
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
    },
    isNameValid() {
      return this.validateDomain(this.editedItem.name) === true;
    },
    showOptionDomainsToDomains(): boolean {
      const store = useRedirectStore();
      return store.redirectType === 'Domains to domains Redirect';
    },
    isDeleteRedirect(): boolean {
      const store = useRedirectStore();
      return store.redirectType === 'Delete Redirect';
    },
  },
  watch: {
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
  <v-row v-if="!isDeleteRedirect">
    <v-col cols="6" class="pr-0">
      <RedirectStep1DomainsToDomainsFrom />
    </v-col>

    <v-col cols="6" class="pl-0">
      <RedirectStep1DomainsToDomainsTo />
    </v-col>
  </v-row>
  <v-row v-if="isDeleteRedirect">
    <v-col cols="12" class="pr-0">
      <RedirectStep1DomainsToDomainsDelete />
    </v-col>
  </v-row>
</template>

<style>
.v-field__input {
  margin-top: 10px;
}

</style>
