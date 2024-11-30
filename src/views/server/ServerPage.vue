<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useServerStore } from '@/stores/modules/server/server';
import moment from 'moment';

export default defineComponent({
  name: 'ServerPage',
  components: {
    //
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      dialogType: "", 
      search: ref(''),
      sortBy: ref('server_ip'),
      sortDesc: ref(false),
      showResult: false,
      resultMessage: {
        success: 0,
        fail: {
          count:0,
          messages: []
        },
      },
      headers: [
        { title: 'SERVER IP', key: 'server_ip' },
        { title: 'TEAM', key: 'team' },
        { title: 'KEY NAME', key: 'key_name' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
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
      },
      defaultItem: {
        id: 0,
        server_ip: '',
        team: '',
        key_name: '',
        private_key: '',
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
  created() {
    this.fetchData()
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
      // return this.editedIndex === -1 ? 'New Server' : 'Import Server'
    },
    isFormValid() {
      const teamValid = this.validateTeam(this.editedItem.team) === true;
      const privateKeyValid = this.validateTeam(this.editedItem.private_key) === true;
      const serverIPValid = this.validateTeam(this.editedItem.server_ip) === true;
      return (this.dialogType === 'import') ? teamValid && privateKeyValid && serverIPValid : teamValid;
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
        const serverStore = useServerStore();
        await serverStore.fetchServer({
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

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      const serverStore = useServerStore();
      serverStore.deleteServer(this.editedItem.id);
      this.closeDelete()
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
    validateIPAddress(value) {
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/;
      const invalidIPs = [
        "0.0.0.0", "1.1.1.1", "127.0.0.1", "169.254.0.0", "192.0.2.0",
        "198.51.100.0", "203.0.113.0", "224.0.0.0", "255.255.255.255",
        "100.64.0.0", "240.0.0.0"
      ];

      if (!ipPattern.test(value)) {
        return 'Please enter a valid IP address (e.g., 54.243.100.131)';
      }

      if (invalidIPs.includes(value)) {
        return 'This IP address cannot be used.';
      }

      return true;
    },

    async save() {
      this.loading = true;
      const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
      this.editedItem.createdAt = currentTime;
      this.editedItem.updatedAt = currentTime;
      const serverStore = useServerStore();
      console.log('hhhh===>', this.editedItem);
      if (this.editedIndex > -1) {
        //
      } else {
        if (this.dialogType === 'import') {
          const ketqua = await serverStore.createServerImport({ server_ip: this.editedItem.server_ip, team: this.editedItem.team, private_key: this.editedItem.private_key });
          this.resultMessage = await ketqua.result;
          if (this.resultMessage.fail.count === 0) {
            this.showResult = false;
            this.items.push(this.editedItem)
          } else {
            this.showResult = true;
          }        
        } else {
          const ketqua = await serverStore.createServer({ server_ip: this.editedItem.server_ip, team: this.editedItem.team });
          this.resultMessage = await ketqua.result;
          if (this.resultMessage.fail.count === 0) {
            this.showResult = false;
            this.items.push(this.editedItem)
          } else {
            this.showResult = true;
          }        
        }
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
        <v-toolbar-title>SERVER</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" label="Search" variant="outlined" hide-details single-line clearable
          @click:clear="handleClearSearch" @input="handleOnSearch">
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn size="small" class="mb-2 ml-1 mr-2" :style="{ backgroundColor: '#CCAA4D', color: '#ffff' }" dark @click="openDialogImport">
              <UploadIcon size="15" color="white" />
              Import server
            </v-btn>
            <v-btn size="small" class="mb-2 ml-1 mr-2" :style="{ backgroundColor: '#7DA77D', color: '#ffff' }" dark
              v-bind="props">
              <SquarePlusIcon size="15" color="white" />
              New server
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field 
                      v-model="editedItem.server_ip" 
                      :rules="[validateIPAddress]" 
                      :disabled="dialogType !== 'import'" 
                      :label="dialogType !== 'import' ? 'Server IP sẽ được thêm vào sau khi server được tạo' : 'Thêm vào Server IP import tại đây'" 
                      density="comfortable">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea 
                      :rules="[validatePrivateKey]" 
                      class="custom-spacing" 
                      v-model="editedItem.private_key"
                      :disabled="dialogType !== 'import'" 
                      :label="dialogType !== 'import' ? 'Private key sẽ được thêm vào sau khi server được tạo' : 'Private key'"  
                      density="comfortable" row="5">
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                      <v-select
                          v-model="editedItem.team"
                          :items="['admin', 'seo-1', 'seo-2', 'seo-3', 'seo-4', 'seo-5', 'seo-6']"
                          label="Team"
                          density="comfortable"
                          :disabled="dialogType === 'edit'" 
                          :rules="[validateTeam]"
                      ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field disabled v-model="editedItem.createdAt" label="Created At"
                      density="comfortable"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field disabled v-model="editedItem.updatedAt" label="Updated At"
                      density="comfortable"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="dialogType !== 'import' && dialogType !== 'edit'">
                    📚 Khi Submit sẽ tạo 01 server mới trên AWS Cloud và thêm 01 serverIP, 01 privateKey vào database
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save" :disabled="!isFormValid">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="green"
                  size="20"
                  class="mr-2"
                >
                </v-progress-circular>
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Lệnh này không thực sự xóa server trên AWS</v-card-title>
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
      <EditIcon size="18" color="gray" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <TrashIcon size="18" color="#FF5252" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />

    </template>
  </v-data-table-server>
    <!-- Hiển thị kết quả chỉ sau khi gọi API xong (khi loading là false) -->
    <v-text v-if="showResult">
    <span class="text-success font-bold">Success: {{ resultMessage.success }}</span>
    <span v-if="resultMessage.fail.count !== 0" class="text-error font-bold">, Fail: {{ resultMessage.fail.count
      }}</span>
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
