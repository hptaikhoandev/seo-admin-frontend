<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRedirectStore } from '@/stores/modules/redirect/redirect';
import moment from 'moment';

export default defineComponent({
  name: 'RedirectStep1',
  components: {
    //
  },
  data() {
    return {
      is301: true,
      domainRedirectFrom:'',
      domainRedirectTo:'',
      redirectType: 'Wildcard Redirect',
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
    showDomainRedirect(): boolean {
      return this.redirectType !== 'Domains to domains Redirect';
    },
  },
  watch: {
    domainRedirectFrom(newDomainRedirectFrom) {
      const store = useRedirectStore();
      store.domainRedirectFrom = newDomainRedirectFrom;
      store.isValidDomainRedirectFrom = this.validateDomain(newDomainRedirectFrom) === true;
    },
    domainRedirectTo(newDomainRedirectTo) {
      const store = useRedirectStore();
      store.domainRedirectTo = newDomainRedirectTo;
      store.isValidDomainRedirectTo = this.validateDomain(newDomainRedirectTo) === true;
    },
    redirectType(newValue, oldValue) {
      const store = useRedirectStore();
      store.redirectType = newValue;
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
          link.setAttribute('download', 'domains.txt');
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
      <v-col class="pb-2" :style="{fontSize: '20px'}">
        Step 1: Choice redirect type
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="4" class="py-0">
        <v-select
          v-model="redirectType"
          label="Redirect Type"
          class="mt-3" 
          :items="['Wildcard Redirect', 'Homepage Redirect']"
        />
      </v-col>
      <v-col cols="2" class="py-1">
        <v-checkbox
          v-model="is301"
          label="301"
          class="mt-3"
          disabled
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
