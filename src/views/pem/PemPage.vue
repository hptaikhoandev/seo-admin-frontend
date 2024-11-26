<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { usePemStore } from '@/stores/modules/pem/pem';
import moment from 'moment';

export default defineComponent({
  name: 'PemPage',
  components: {
    //
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('pem'),
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
        // { title: 'ID', align: 'start', sortable: false, key: 'id', },
        { title: 'PRIVATE KEY', key: 'pem' },
        { title: 'TEAM', key: 'team' },
        { title: 'FILE NAME', key: 'fileName' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        pem: '',
        team: '',
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        pem: '',
        team: '',
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
      return this.editedIndex === -1 ? 'New Pem' : 'Edit Pem'
    },
    isFormValid() {
      const teamValid = this.validatePem(this.editedItem.team) === true;
      return teamValid;
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
        const pemStore = usePemStore();
        await pemStore.fetchPem({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await pemStore.pem;
        this.totalItems = await pemStore.total;
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

    async deleteItemConfirm() {
      this.loading = true;
      const pemStore = usePemStore();
      const ketqua = await pemStore.deletePem(this.editedItem.id, this.editedItem.team);
      this.resultMessage = ketqua.result;
      if (this.resultMessage.fail.count === 0) {
        this.showResult = false;
        this.items.splice(this.editedIndex, 1)
      } else {
        this.showResult = true;
      } 
      this.loading = false;
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
    validatePem(value) {
      return !!value || "Pem is required"; 
    },
    validateTeam(value) {
      return !!value || "Team is required"; 
    },
    async save() {
      this.loading = true;
      const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
      this.editedItem.createdAt = currentTime;
      this.editedItem.updatedAt = currentTime;
      if (this.editedIndex > -1) {
        //
      } else {
        const pemStore = usePemStore();
        const ketqua = await pemStore.createPem({ pem: this.editedItem.pem, team: this.editedItem.team });
        this.resultMessage = ketqua.result;
        if (this.resultMessage.fail.count === 0) {
          this.showResult = false;
          this.items.push(this.editedItem)
        } else {
          this.showResult = true;
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
    <template v-slot:[`item.pem`]="{ item }">
      <span>******************</span>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>PEM</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" label="Search" variant="outlined" hide-details single-line clearable
          @click:clear="handleClearSearch" @input="handleOnSearch">
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <!-- <v-btn class="mb-2" color="success" dark v-bind="props">
              <SquarePlusIcon size="18" color="green" />
              <b>New Pem</b>
            </v-btn> -->
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-textarea disabled class="custom-spacing" v-model="editedItem.pem" label="Private key"
                      density="comfortable" row="5"></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select v-model="editedItem.team"
                      :items="['admin', 'seo-1', 'seo-2', 'seo-3', 'seo-4', 'seo-5', 'seo-6']" label="Team"
                      density="comfortable" :rules="[validateTeam]" :disabled="formTitle === 'Edit Pem'">
                    </v-select>
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
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="green"
                  size="20"
                  class="mr-2"
                >
                </v-progress-circular>
                  OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <EditIcon size="18" color="green" class="mr-2" style="cursor: pointer;" @click="editItem(item)" />
      <!-- <TrashIcon size="18" color="red" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" /> -->
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
