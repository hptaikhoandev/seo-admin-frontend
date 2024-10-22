<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useEmailStore } from '@/stores/modules/email/email';


export default defineComponent({
  name: 'EmailPage',
  components: {
    //
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('email'),
      sortDesc: ref(false),
      headers: [
        { title: 'ID', align: 'start', sortable: false, key: 'id',},
        { title: 'EMAIL', key: 'email' },
        { title: 'USER ID', key: 'userId' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        email: '',
        userId: 1,
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        email: '',
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
      return this.editedIndex === -1 ? 'New Email' : 'Edit Email'
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
        const emailStore = useEmailStore();
        await emailStore.fetchEmail({ 
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await emailStore.email;
        this.totalItems = await emailStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    submitForm() {
      // Xử lý dữ liệu form sau khi submit
      console.log('>>>>> submitForm');
      alert('submitForm');
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

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      const emailStore = useEmailStore();
      emailStore.deleteEmail(this.editedItem.id);
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
      const emailStore = useEmailStore();
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        emailStore.updateEmail({ id: this.editedItem.id, userId: this.editedItem.userId, email: this.editedItem.email });
      } else {
        this.items.push(this.editedItem)
        emailStore.createEmail({ userId: this.editedItem.userId, email: this.editedItem.email });

      }
      this.close()
    },

  }
});

</script>
<template>
  <!-- <v-data-table-server
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
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>EMAIL</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-text-field
          v-model="search"
          label="Search"
          variant="outlined"
          hide-details
          single-line
          clearable
          @click:clear="handleClearSearch"
          @input="handleOnSearch"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              class="mb-2"
              color="success"
              dark
              v-bind="props"
            >
            <SquarePlusIcon size="24" color="green" />
              <b>New Email</b>
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
                    <v-text-field disabled v-model="editedItem.id" label="ID" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.email" label="Email" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field disabled v-model="editedItem.userId" label="User ID" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field disabled v-model="editedItem.createdAt" label="Created At" density="comfortable"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field disabled v-model="editedItem.updatedAt" label="Updated At" density="comfortable"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
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
      
      <EditIcon size="24" color="orange" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <TrashIcon size="24" color="red" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />
    </template>
  </v-data-table-server> -->

  <v-container>
    <!-- Title -->
    <v-card-title class="">
      White List IP
    </v-card-title>

    <v-form @submit.prevent="submitForm" class="mt-4">
      <!-- Input Name -->
      <v-text-field label="xxx" outlined required></v-text-field>

      <!-- Input Age -->
      <v-text-field label="yyy" outlined type="number" required></v-text-field>

      <!-- Input Address -->
      <v-text-field label="zzz" outlined required></v-text-field>

      <!-- Submit Button -->
      <v-btn class="mt-4 bg-success text-white mx-auto d-block" @click="submitForm">
        Submit
      </v-btn>
    </v-form>
  </v-container>

</template>

<style >
.custom-spacing .v-label {
  margin-bottom: 25px; 
}
</style>
