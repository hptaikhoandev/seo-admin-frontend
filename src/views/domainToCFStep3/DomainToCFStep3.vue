<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useMessageStore } from '@/stores/modules/message/message';
import { useDomainStore } from '@/stores/modules/domain/domain';

export default defineComponent({
  name: 'DomainToCFStep3',
  components: {
    //
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('body'),
      sortDesc: ref(false),
      selected: ref([]),
      isSortData: false,
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
    // 
  },
  created() {
    //
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Message' : 'Edit Message'
    },
    showStept3(): boolean {
      const store = useDomainStore();
      return store.domainNS.length > 0;
    },

  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    submitStep3() {
      const store = useDomainStore();
      let dataExport = store.domainExport;
      dataExport = dataExport.sort((a, b) => {
        const nsA = a.ns.toLowerCase();
        const nsB = b.ns.toLowerCase();
        return nsA.localeCompare(nsB); // Sắp xếp từ A-Z
      });
      let csvData = "";
      if (this.isSortData) {
         // Tổ chức dữ liệu theo nhóm `ns`
        const groupedData = new Map();
        dataExport.forEach(item => {
          const ns = item.ns; // Lấy Name Servers
          if (!groupedData.has(ns)) {
            groupedData.set(ns, []); // Nếu chưa có nhóm, tạo mới
          }
          groupedData.get(ns).push(item.domain); // Thêm domain vào nhóm
        });

        // Tạo nội dung CSV
        const csvContentSort = Array.from(groupedData.entries())
          .map(([ns, domains]) => {
            const domainsFormatted = domains.join("\n"); // Danh sách domain
            const nsFormatted = ns.split(",").join("\n"); // Định dạng Name Servers
            return `${domainsFormatted}\nNS:\n${nsFormatted}`;
          })
          .join("\n\n"); // Thêm khoảng trắng giữa các cụm

        csvData = csvContentSort;
      } else {
        // Create CSV content from dataExport
        const csvHeaders = "Domain,Name Servers\n"; // Header row
        const csvContent = dataExport?.map(item => `${item.domain},"${item.ns}"`).join("\n");
        csvData = csvHeaders + csvContent;

      }
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
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
      updateSortData(newValue) {
      this.isSortData = newValue;
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
  <v-toolbar flat v-if="showStept3">
    <v-toolbar-title>
      <div class="d-flex align-center">
        <span>Step 3: export to Excel</span>
        <v-btn class="text-white mx-2" :style="{ backgroundColor: '#7DA77D' }" @click="submitStep3">
          Export
        </v-btn>
        <v-checkbox
          v-model="isSortData"
          label="Sort data"
          class="mt-5"
          @update:modelValue="updateSortData"
        />
      </div>
    </v-toolbar-title>
  </v-toolbar>
</template>

<style>
/* .custom-spacing .v-label {
  margin-bottom: 25px;
} */
</style>
