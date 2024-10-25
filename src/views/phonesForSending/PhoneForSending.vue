<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useDomainStore } from '@/stores/modules/domain/domain';
import moment from 'moment';
import { Loader2Icon, ReloadIcon } from 'vue-tabler-icons';
import { RedoOutlined } from '@ant-design/icons-vue';


export default defineComponent({
  name: 'InputDomain',
  components: {
    //
  },
  data() {
    return {
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
        ns: '',
        status: '',
        userId: 1,
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        name: '',
        ns: '',
        status: '',
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
    this.fetchData()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
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
    async fetchData() {
      this.loading = true;
      try {
        const domainStore = useDomainStore();
        await domainStore.fetchDomain({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await domainStore.domain;
        this.totalItems = await domainStore.total;
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
      this.items = [];
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
      console.log(">>>>onSearch", this.search);
      this.page = 1;
      this.fetchData();
    },
    handleSortBy({ page, itemsPerPage, sortBy }) {
      if (sortBy.length === 0) return;
      this.sortBy = sortBy[0].key;
      this.sortDesc = (sortBy[0].order === 'desc') ? true : false;
      console.log(">>>>updateSortBy", this.sortBy);
      this.page = 1;
      this.fetchData();
    },
    handleClearSearch() {
      this.page = 1;
      this.fetchData();
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      // const domainStore = useDomainStore();
      // domainStore.deleteDomain(this.editedItem.id);
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
      const domainStore = useDomainStore();

      // Access the file uploaded
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      try {
        // Read the content of the file
        const fileContent = await this.readFile(file);

        // Assuming each domain is on a new line in the text file
        const domainList = fileContent.split('\n').map(domain => domain.trim()).filter(domain => domain);

        const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');

        // Loop through the list and add domains to this.items if they don't already exist
        domainList.forEach(domainName => {
          const nameExists = this.items.some(item => item.name === domainName);

          if (!nameExists) {
            const newDomain = {
              name: domainName,
              createdAt: currentTime,
              updatedAt: currentTime,
              // Add other domain fields as needed
            };

            // Add the new domain to this.items
            this.items.push(newDomain);

            // Optionally, update the domain store as well
            // domainStore.createDomain(newDomain);
          }
        });

        console.log('Imported domains:', this.items);

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
      const domainStore = useDomainStore();
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
        console.log(">>>>> savexxx", this.items);
        // domainStore.updateDomain({ id: this.editedItem.id, name: this.editedItem.name });
      } else {
        console.log(">>>>> saveyyy", this.items);

        this.items.push(this.editedItem)
        // domainStore.createDomain({ name: this.editedItem.name, ns: this.editedItem.ns, status: this.editedItem.status, userId: this.editedItem.userId });

      }
      this.close();
    },

  }
});

</script>
<template>
  <v-data-table-server 
    :headers="headers" 
    :items="items" item-value="id" 
    :items-per-page="itemsPerPage"
    :items-length="totalItems" 
    :page.sync="page" 
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange" 
    hover 
    hide-default-footer
    :loading="loading" 
    @update:options="handleSortBy"
    class="bold-headers fixed-height-table"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          Step 1: input domains
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2 ml-2 mr-1" :style="{ backgroundColor: '#FF5252' }" color="white" dark @click="reset">
              <ReloadIcon size="20" color="white" />
            </v-btn>
            <v-btn class="mb-2 ml-2 mr-1" :style="{ backgroundColor: '#6A8DBA' }" color="white" dark @click="downloadFile">
              <DownloadIcon size="20" color="white" />
              Download sample file
            </v-btn>
            <v-btn class="mb-2 mx-1" :style="{ backgroundColor: '#CCAA4D' }" color="white" dark @click="$refs.fileInput.click()">
              <UploadIcon size="20" color="white" />
              Import domains
            </v-btn>
            <input type="file" ref="fileInput" @change="importDomains" style="display:none;" />
            <v-btn class="mb-2 ml-1 mr-2" :style="{ backgroundColor: '#7DA77D' }" color="white" dark v-bind="props">
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
                  <!-- Mỗi dòng sẽ là một trường (v-text-field) -->
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.name" label="Name" density="comfortable"></v-text-field>
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
              <v-btn color="blue-darken-1" variant="text" @click="save">
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

        <v-spacer></v-spacer>
        <v-text-field class="mr-2" v-model="search" label="Search" variant="outlined" hide-details single-line clearable
          @click:clear="handleClearSearch" @input="handleOnSearch">
        </v-text-field>

      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <EditIcon size="18" color="orange" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <TrashIcon size="18" color="#FF5252" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />
    </template>
  </v-data-table-server>
</template>
<style scoped>
.table-container {
  max-height: 150px;  /* Đặt chiều cao tối đa */
  overflow-y: auto;   /* Kích hoạt cuộn dọc */
}

.table-container .v-data-table__wrapper {
  max-height: 100%; /* Đảm bảo wrapper sử dụng chiều cao của container */
}.custom-spacing .v-label {
  margin-bottom: 25px;
}

/* .bold-headers .v-table>.v-table__wrapper>table>tbody>tr>th,
.v-table>.v-table__wrapper>table>tfoot>tr>th {
  font-weight: bold !important;
} */

</style>
