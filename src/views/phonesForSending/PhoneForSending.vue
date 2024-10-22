<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { usePhoneStore } from '@/stores/modules/phone/phone';


export default defineComponent({
  name: 'PhoneForSending',
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
      selectedRows: ref([]) as Ref<string[]>,
      selected: ref([]),
      headers: [
        { title: 'ID', align: 'start', sortable: false, key: 'id',},
        { title: 'NUMBER', align: 'start', key: 'number' },
        { title: 'VENDOR', align: 'start', key: 'vendor' },
        { title: 'USER ID', align: 'start', key: 'userId' },
        { title: 'CREATED AT', align: 'start', key: 'createdAt' },
        { title: 'UPDATED AT', align: 'start', key: 'updatedAt' },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        number: '',
        vendor: '',
        userId: 1,
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        number: '',
        vendor: '',
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
  created () {
    this.fetchData()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Phone' : 'Edit Phone'
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
        const phoneStore = usePhoneStore();
        await phoneStore.fetchPhone({ 
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await phoneStore.phone;
        this.totalItems = await phoneStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
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
    handleSelectionChange(selectedItems) {
      const phoneStore = usePhoneStore();
      phoneStore.selectedPhones = selectedItems;
    },

    handleRowClick(row) {
      console.log("Selected Rows: ", this.selected);
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
      const phoneStore = usePhoneStore();
      phoneStore.deletePhone(this.editedItem.id);
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
      const phoneStore = usePhoneStore();
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        phoneStore.updatePhone({ id: this.editedItem.id, number: this.editedItem.number, userId: this.editedItem.userId, vendor: this.editedItem.vendor });
      } else {
        this.items.push(this.editedItem)
        phoneStore.createPhone({ number: this.editedItem.number, userId: this.editedItem.userId, vendor: this.editedItem.vendor });

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
    item-value="number"
    :items-per-page="itemsPerPage"
    :items-per-page-options="[5]"
    :items-length="totalItems"
    :page.sync="page"
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange"
    hover
    :loading="loading"
    @update:options="handleSortBy"
    show-select
    v-model="selected"
    @update:modelValue="handleSelectionChange"
  >
  
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Step 1: chọn số phone</v-toolbar-title>
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
      </v-toolbar>
    </template>

    
    
  </v-data-table-server>
</template>

<style >
.custom-spacing .v-label {
  margin-bottom: 25px; 
}
</style>
