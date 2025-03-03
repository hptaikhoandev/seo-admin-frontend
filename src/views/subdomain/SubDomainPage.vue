<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useSubDomainStore } from '@/stores/modules/subDomain/subDomain';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import { PlayerPlayFilledIcon, RefreshDotIcon, PlayerStopFilledIcon } from 'vue-tabler-icons';

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
        { title: 'Acount ID', key: 'account_id' },
        { title: 'TEAM', key: 'team' },
        { title: 'Name', key: 'name', align: 'center', headerAlign: 'center' },
        { title: 'Old Content', key: 'old_content', align: 'center', headerAlign: 'center' },
        { title: 'Content', key: 'content', align: 'center', headerAlign: 'center' },
        { title: 'Type', key: 'type' },
        { title: 'Created At', key: 'created_on' },
        { title: 'Updated At', key: 'modified_on' },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        server_ip: '',
        team: '',
        key_name: '',
        private_key: '',
        createdAt: '',
        updatedAt: '',
        loadingStart: false,
        loadingRestart: false,
        loadingStop: false,
        iconStartDisable: true,
        iconRestartDisable: false,
        iconStopDisable: false,
        authMethod: "Token",
        username: '',
      },
      defaultItem: {
        id: 0,
        server_ip: '',
        team: '',
        key_name: '',
        private_key: '',
        createdAt: '',
        updatedAt: '',
        loadingStart: false,
        loadingRestart: false,
        loadingStop: false,
        iconStartDisable: true,
        iconRestartDisable: false,
        iconStopDisable: false,
        authMethod: "Token",
        username: '',
      },
      items: ref([]) as Ref<any[]>,
      page: ref(1),
      itemsPerPage: ref(10),
      totalItems: ref(110),
      loading: ref(false),
    };
  },

  mounted() {
    //
  },
  async created() {
    await this.fetchData();
  },
  computed: {
    formTitle() {
      switch (this.dialogType) {
        case 'import':
          return 'Import Server';
        case 'edit':
          return 'Edit Server';
        default:
          return 'New Server';
      }
    },
    isFormValid() {
      const teamValid = this.validateTeam(this.editedItem.team) === true;
      const privateKeyValid = this.validateTeam(this.editedItem.private_key) === true;
      const serverIPValid = this.validateTeam(this.editedItem.server_ip) === true;
      return (this.dialogType === 'import') ? teamValid && privateKeyValid && serverIPValid : teamValid;
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
    dialogDelete(val) {
      val || this.closeDelete()
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
        if (userRole !== 'admin') this.search = userRole;
        const serverStore = useSubDomainStore();
        await serverStore.fetchSubDomains({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await serverStore.server;
        this.totalItems = await serverStore.total;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    openDialogImport() {
      this.dialogType = 'import';
      this.dialog = true;
    },

    editItem(item) {
      this.dialogType = 'edit';
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

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.dialogType = "";
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    validateTeam(value) {
      return !!value || "Team is required";
    },
    validatePrivateKey(value) {
      return !!value || "Key Name is required";
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
        <v-toolbar-title>Sub-Domain History</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" label="Search" variant="outlined" hide-details single-line clearable
          @click:clear="handleClearSearch" @input="handleOnSearch">
        </v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    
  </v-data-table-server>
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
