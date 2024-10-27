<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useMessageStore } from '@/stores/modules/message/message';
import { useDomainStore } from '@/stores/modules/domain/domain';

export default defineComponent({
  name: 'Step3',
  components: {
    //
  },
  data() {
    return {
      domainStore: useDomainStore,
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('body'),
      sortDesc: ref(false),
      selected: ref([]),
      headers: [
        { title: 'NAME', key: 'name' },
        { title: 'NS', key: 'ns' },
        { title: 'STATUS', key: 'status' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        body: '',
        userId: 1,
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        body: '',
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
      return this.editedIndex === -1 ? 'New Message' : 'Edit Message'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const messageStore = useMessageStore();
        await messageStore.fetchMessage({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await messageStore.message;
        this.totalItems = await messageStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    submitStep3() {
      const dataExport = this.domainStore.domainExport;

      // Create CSV content from dataExport
      const csvHeaders = "Domain,Name Servers\n"; // Header row
      const csvContent = dataExport.map(item => `${item.domain},"${item.ns}"`).join("\n");
      const csvData = csvHeaders + csvContent;

      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: "text/csv" });

      // Create a download link for the Blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "domains_list.csv";
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object and the link element
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    handleSelectionChange(selectedItems) {
      const messageStore = useMessageStore();
      messageStore.selectedMessages = selectedItems;
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

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      const messageStore = useMessageStore();
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        messageStore.updateMessage({ id: this.editedItem.id, userId: this.editedItem.userId, body: this.editedItem.body });
      } else {
        this.items.push(this.editedItem)
        messageStore.createMessage({ userId: this.editedItem.userId, body: this.editedItem.body });
      }
      this.close()
    },
  }
});

</script>
<template>
  <v-toolbar flat>
    <v-toolbar-title>
      Step 3(Final): Export to Excel
      <v-btn class="text-white mx-2" :style="{ backgroundColor: '#7DA77D' }" @click="submitStep3">
        Export
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
</template>

<style>
/* .custom-spacing .v-label {
  margin-bottom: 25px;
} */
</style>
