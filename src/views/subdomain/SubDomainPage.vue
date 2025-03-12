<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useSubDomainStore } from '@/stores/modules/subDomain/subDomain';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';


export default defineComponent({
  name: 'SubDomainPage',
  components: {
    //
  },
  data() {
    return {
      currentDateTime: ref(''),
      dialog: false,
      dialogDelete: false,
      dialogType: "",
      search: ref(''),
      typeSearch: ref('A & CNAME'),
      sortBy: ref('account_id'),
      sortDesc: ref(false),
      showResult: false,
      resultMessage: {
        success: 0,
        fail: {
          count: 0,
          messages: []
        },
      },
      headers: [
        { title: 'TEAM', key: 'team' },
        { title: 'Domain', key: 'domain', align: 'center', headerAlign: 'center' },
        { title: 'Name', key: 'name', align: 'center', headerAlign: 'center' },
        { title: 'Content', key: 'content', align: 'center', headerAlign: 'center' },
        { title: 'Type', key: 'type' },
        { title: 'Created At', key: 'created_on' },
        { title: 'Updated At', key: 'modified_on' },
        { title: 'History', key: 'history', sortable: false },
        { title: 'Update Cloudflare', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        team: '',
        name: '',
        content: '',
        domain: '',
        created_on: '',
        modified_on: '',
        loadingStart: false,
        loadingRestart: false,
        loadingStop: false,
        iconStartDisable: true,
        iconRestartDisable: false,
        iconStopDisable: false,
        type: '',
        zone_id: '',
        account_id: '',
        dns_id: '',
      },
      defaultItem: {
        id: 0,
        team: '',
        name: '',
        content: '',
        domain: '',
        created_on: '',
        modified_on: '',
        loadingStart: false,
        loadingRestart: false,
        loadingStop: false,
        iconStartDisable: true,
        iconRestartDisable: false,
        iconStopDisable: false,
        type: '',
        zone_id: '',
        account_id: '',
        dns_id: '',
      },
      items: ref([]) as Ref<any[]>,
      page: ref(1),
      itemsPerPage: ref(10),
      totalItems: ref(0),
      loading: ref(false),
      subItems: ref([]) as Ref<any[]>,
      subPage: ref(1),
      subItemsPerPage: ref(10),
      totalSubItems: ref(0),
      subSortBy: ref('created_on'),
      subSortDesc: ref(false),
      subHeaders: [
        { title: 'Name', key: 'name', align: 'center', headerAlign: 'center' },
        { title: 'Content', key: 'content', align: 'center', headerAlign: 'center' },
        { title: 'Type', key: 'type' },
        { title: 'Created At', key: 'created_on' },
        { title: 'Updated At', key: 'modified_on' },
      ],
      showExportToExcel: ref(false),
      isSortData: false,
    };
  },

  mounted() {
    //
  },
  async created() {
    // await this.fetchData();
  },
  computed: {
    formTitle() {
      switch (this.dialogType) {
        case 'import':
          return 'Import Cloudflare';
        case 'edit':
          return 'Update Cloudflare';
        default:
          return 'Add New Cloudflare';
      }
    },
   
    formattedDateTime() {
      // Mỗi khi currentDateTime thay đổi, hàm này sẽ tự động chạy lại
      return moment(this.currentDateTime, "DD:MM:YY HH:mm:ss").format("DD:MM:YY HH:mm:ss");
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    showFunc() {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;
      const parsedUser = JSON.parse(storedUser);
      if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return false;
      const user = jwtDecode(parsedUser.user.token);
      const userRole = (user as any).roleId;
      if (!(user && userRole)) return false;
      return userRole === 'admin';
    },
    async fetchData() {
      this.loading = true;
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
        const user = jwtDecode(parsedUser.user.token);
        const userRole = (user as any).roleId;
        if (!(user && userRole)) return [];
        // if (userRole !== 'admin') this.search = userRole;
        
        const serverStore = useSubDomainStore();
        if(this.typeSearch  == 'NS') {
          await serverStore.fetchNSSubDomains({
            page: this.page,
            limit: this.itemsPerPage,
            search: this.search,
            sortBy: this.sortBy,
            sortDesc: this.sortDesc,
            team: userRole
          });
        } else {
          await serverStore.fetchSubDomains({
            page: this.page,
            limit: this.itemsPerPage,
            search: this.search,
            sortBy: this.sortBy,
            sortDesc: this.sortDesc,
            team: userRole
          });
        }
        
        this.items = await serverStore.server;
        this.totalItems = await serverStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
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
    async showSubDomainHistory(item) {
      this.subItems = [];
      this.dialog = true;
      await this.fetchSubData(item);
    },
    closeSubDomainHistory(item) {
      this.dialog = false;
    },
    close() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      })
      this.dialogType = "";
    },
    async fetchSubData(item) {
      this.loading = true;
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
        const user = jwtDecode(parsedUser.user.token);
        const userRole = (user as any).roleId;
        if (!(user && userRole)) return [];
        const serverStore = useSubDomainStore();
        await serverStore.fetchSubDomainsHistory({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
          name: item.name,
          account_id: item.account_id,
          current_id: item.id,
          zone_id: item.zone_id
        });
        this.subItems = await serverStore.server;
        this.totalSubItems = await serverStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    handleSubPageChange(newPage, item) {
      this.subPage = newPage;
      this.fetchSubData(item);
    },
    handleSubItemsPerPageChange(newItemsPerPage, item) {
      this.subItemsPerPage = newItemsPerPage;
      this.subPage = 1;
      this.fetchSubData(item);
    },
    handleSubOnSearch(item) {
      this.subPage = 1;
      this.fetchSubData(item);
    },
    handleSubSortBy({ page, itemsPerPage, sortBy, item }) {
      if (sortBy.length === 0) return;
      this.subSortBy = sortBy[0].key;
      this.subSortDesc = (sortBy[0].order === 'desc') ? true : false;
      this.subPage = 1;
      this.fetchSubData(item);
    },
    updateSortData(newValue) {
      this.isSortData = newValue;
    },
    exportToExcel() {
      let dataExport = this.items;
      dataExport = dataExport.sort((a, b) => {
        const nsA = a.content.toLowerCase();
        const nsB = b.content.toLowerCase();
        return nsA.localeCompare(nsB); // Sắp xếp từ A-Z
      });
      let csvData = "";
      if (this.isSortData) {
         // Tổ chức dữ liệu theo nhóm `ns`
        const groupedData = new Map();
        dataExport.forEach(item => {
          const ns = item.content; // Lấy Name Servers
          if (!groupedData.has(ns)) {
            groupedData.set(ns, []); // Nếu chưa có nhóm, tạo mới
          }
          groupedData.get(ns).push(item.domain); // Thêm domain vào nhóm
        });
  
        // Tạo nội dung CSV
        const csvContentSort = Array.from(groupedData.entries())
          .map(([ns, domains]) => {
            const domainsFormatted = domains.join("\n"); // Danh sách domain
            const nsFormatted = ns.replace(" ", "").split(",").join("\n"); // Định dạng Name Servers
            return `${domainsFormatted}\nNS:\n${nsFormatted}`;
          })
          .join("\n\n"); // Thêm khoảng trắng giữa các cụm

        csvData = csvContentSort;
      } else {
        // Create CSV content from dataExport
        const csvHeaders = "Domain,Name Servers\n"; // Header row
        const csvContent = dataExport?.map(item => `${item.domain},"${item.content}"`).join("\n");
        csvData = csvHeaders + csvContent;

      }
      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: "text/csv" });
      // Create a download link for the Blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ns_list.csv";
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      // Clean up the URL object and the link element
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    editItem(item) {
      this.dialogType = 'edit';
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async save() {
      this.loading = true;
      const subDomainStore = useSubDomainStore();
      if (this.dialogType === 'edit') {
        const ketqua = await subDomainStore.updateServer({ id: this.editedItem.id, zone_id: this.editedItem.zone_id, content: this.editedItem.content, name: this.editedItem.name, account_id: this.editedItem.account_id, dns_id: this.editedItem.dns_id });
        this.resultMessage = ketqua.result;
        this.showResult = true;

      } 
      this.fetchData();
      this.close()
      this.loading = false;
    },
  }
});

</script>
<template>
  <v-data-table-server :headers="headers" :items="items" item-value="id" :items-per-page="itemsPerPage"
    :items-length="totalItems" :page.sync="page" @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange" hover :loading="loading" @update:options="handleSortBy">
    <template v-slot:top>
      <v-toolbar flat>
        <v-col cols="3">  
          <v-toolbar-title>Sub-Domain History</v-toolbar-title>
        </v-col>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-col cols="5">  
          <v-text-field v-model="search" label="Search as format domain1.com, domain2.com,..." variant="outlined" hide-details single-line clearable
            @click:clear="handleClearSearch"
          >
          </v-text-field>
        </v-col>
        <v-col cols="2">  
          <v-select
            v-model="typeSearch"
            :items="['A & CNAME', 'NS']"
            label="Loại"
            hide-details 
            single-line
            variant="outlined"
            @update:modelValue="(val: any) => { 
              typeSearch = val; 
              showExportToExcel = val === 'NS'; 
            }" 
          ></v-select>
        </v-col>
       
        <v-btn text @click="handleOnSearch()" :disabled="loading" style="height: 42px; margin-left: 1em; display: flex; align-items: center; justify-content: center; background-color: rgb(204, 170, 77);">Search</v-btn>
      
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:item.history="{ item }">
      <div class="d-inline-flex align-center">
        <v-btn 
          variant="text"
          class="d-inline-flex align-center justify-center"
          @click="showSubDomainHistory(item)"
          :class="{ 'opacity-30 pointer-events-none': item.iconRestartDisable }" 
          style="min-width:30px; width: 30px; height: 40px; cursor: pointer;"
          :disabled="item.iconRestartDisable"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </v-btn>
      </div>
      <template>
        <v-dialog v-model="dialog" max-width="824px" scrim="rgba(0, 0, 0, 0.2)">
          <v-card elevation="0">
            <v-card-title class="text-h5">Sub-Domain {{item.name}}</v-card-title>
            <v-card-text>
              <v-container>
                <v-data-table-server :headers="subHeaders" :items="subItems" item-value="id-sub" :items-per-page="subItemsPerPage"
                  :items-length="totalSubItems" :page.sync="subPage" @update:page="handleSubPageChange"
                  @update:items-per-page="handleSubItemsPerPageChange" hover :loading="loading" @update:options="handleSubSortBy"
                >
                </v-data-table-server>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeSubDomainHistory">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <v-dialog v-model="dialogDelete" max-width="500px" scrim="rgba(0, 0, 0, 0.2)">
          <v-card elevation="0">
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field :disabled="true" v-model="editedItem.name"
                      :label="'Name'"
                      density="comfortable">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field :disabled="!(dialogType === 'edit' || dialogType === 'import')" v-model="editedItem.content"
                      :label="'Content'"
                      density="comfortable">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save" :disabled="false">
                <v-progress-circular v-if="loading" indeterminate color="green" size="20" class="mr-2">
                </v-progress-circular>
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
  
    <template v-slot:item.actions="{ item }">
      <div class="d-inline-flex align-center">
        <EditIcon title="Update link server" size="18" color="orange" class="ml-2" style="cursor: pointer;"
          @click="editItem(item)" />
      </div>
    </template>
   
  </v-data-table-server>
  <v-toolbar flat v-if="showExportToExcel">
    <v-toolbar-title>
      <div class="d-flex align-center">
        <span>Export to Excel</span>
        <v-btn class="text-white mx-2" :style="{ backgroundColor: '#7DA77D' }" @click="exportToExcel">
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
  <!-- Hiển thị kết quả chỉ sau khi gọi API xong (khi loading là false) -->
  <v-text v-if="showResult">
    <ul>
      <span> {{ 'Time: ' + currentDateTime + ' ' }} </span>
    </ul>
    <ul>
      <span class="text-success font-bold">Success: {{ resultMessage.success }}</span>
    </ul>
    <ul>
      <span v-if="resultMessage.fail.count !== 0" class="text-error font-bold">Fail: {{ resultMessage.fail.count}}</span>
    </ul>
  </v-text>
  <v-text v-if="showResult && resultMessage.fail.count !== 0">
    <ul>
      <li v-for="(message, index) in resultMessage.fail.messages" :key="index" class="text-error font-bold">
        {{ message }}
      </li>
    </ul>
  </v-text>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

.v-field--variant-filled textarea {
  padding-top: 20px;
}
</style>
