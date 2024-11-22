<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useDomainStore } from '@/stores/modules/domain/domain';


export default defineComponent({
  name: 'Domain',
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
        { title: 'NS', key: 'ns' },
        { title: 'STATUS', key: 'status' },
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
      itemsPerPage: ref(10),
      totalItems: ref(110),
      loading: ref(false),
    };
  },
  
  mounted() {
    // this.fetchData();
  },
  created () {
    this.fetchData()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
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
      const domainStore = useDomainStore();
      domainStore.deleteDomain(this.editedItem.id);
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

    save() {
      const domainStore = useDomainStore();
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        domainStore.updateDomain({ id: this.editedItem.id, name: this.editedItem.name });
      } else {
        this.items.push(this.editedItem)
        domainStore.createDomain({ name: this.editedItem.name, ns: this.editedItem.ns, status: this.editedItem.status, userId: this.editedItem.userId });

      }
      this.close()
    },

  }
});

</script>
<template>
  <v-data-table-server 
    :headers="headers" 
    :items="items" 
    item-value="id" 
    :items-per-page="itemsPerPage"
    :items-length="totalItems" 
    :page.sync="page" 
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange" 
    hover 
    :loading="loading" 
    @update:options="handleSortBy"
    class="bold-headers"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Step 1: input domains</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" label="Search" variant="outlined" hide-details single-line clearable
          @click:clear="handleClearSearch" @input="handleOnSearch">
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2 ml-2 mr-1 bg-primary" color="white" dark v-bind="props">
              <DownloadIcon size="18" color="white" />
              <b>Download sample</b>
            </v-btn>
            <v-btn class="mb-2 mx-1 bg-warning" color="white" dark v-bind="props">
              <UploadIcon size="18" color="white" />
              <b>Import domains</b>
            </v-btn>
            <v-btn class="mb-2 ml-1 mr-2 bg-success" color="white" dark v-bind="props">
              <SquarePlusIcon size="18" color="white" />
              <b>New domain</b>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.name" label="Name" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field disabled v-model="editedItem.ns" label="NS" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field disabled v-model="editedItem.status" label="Status" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field disabled v-model="editedItem.createdAt" label="Created At"
                      density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
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
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">

      <EditIcon size="18" color="orange" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <TrashIcon size="18" color="red" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />
    </template>
  </v-data-table-server>

  <v-toolbar flat>
    <v-toolbar-title>
      Step 2: submit to Cloudflare
      <v-btn class="bg-success text-white mx-2" @click="submitToCF">
        Submit
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
  <v-toolbar flat>
    <v-toolbar-title>
      Step 3: export to Excel
      <v-btn class="bg-success text-white mx-2" @click="submitToCF">
        Export
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
</template>
<style >
.custom-spacing .v-label {
  margin-bottom: 25px; 
}
.bold-headers .v-table > .v-table__wrapper > table > tbody > tr > th, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > th {
  font-weight: bold !important;
}
</style>
