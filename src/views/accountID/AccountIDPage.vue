<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useAccountIDStore } from '@/stores/modules/accountID/accountid';
import moment from 'moment';

export default defineComponent({
  name: 'AccountIDPage',
  components: {
    //
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('team'),
      sortDesc: ref(false),
      headers: [
      // { title: 'ID', align: 'start', sortable: false, key: 'id', },
        { title: 'TEAM', key: 'team' },
        { title: 'ACCOUNT ID', key: 'account_id' },
        { title: 'EMAIL', key: 'email' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        team: '',
        account_id: '',
        email: '',
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        team: '',
        account_id: '',
        email: '',
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
      return this.editedIndex === -1 ? 'New AccountId' : 'Edit AccountId'
    },
    isFormValid() {
      const teamValid = this.validateTeam(this.editedItem.team) === true;
      const accountIDValid = this.validateAccountID(this.editedItem.account_id) === true;
      const emailValid = this.validateEmail(this.editedItem.email) === true;
      return teamValid && accountIDValid && emailValid;
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
        const accountIdStore = useAccountIDStore();
        await accountIdStore.fetchAccountId({
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
        });
        this.items = await accountIdStore.accountId;
        this.totalItems = await accountIdStore.total;
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

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      const accountIdStore = useAccountIDStore();
      accountIdStore.deleteAccountId(this.editedItem.id);
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
    validateEmail: value => {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return (
        emailRegex.test(value) ||
        "Please enter a valid email address." 
      );
    },
    validateAccountID(value) {
      return !!value || "AccountID is required"; 
    },
    validateTeam(value) {
      return !!value || "Team is required"; 
    },
    async save() {
      const accountIdStore = useAccountIDStore();
      const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
      this.editedItem.createdAt = currentTime;
      this.editedItem.updatedAt = currentTime;
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
        await accountIdStore.updateAccountId({ id: this.editedItem.id, team: this.editedItem.team, email: this.editedItem.email, account_id: this.editedItem.account_id });
      } else {
        this.items.push(this.editedItem)
        await accountIdStore.createAccountId({ team: this.editedItem.team, email: this.editedItem.email, account_id: this.editedItem.account_id  });

      }
      await this.fetchData();
      await this.close()
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
        <v-toolbar-title>ACCOUNT ID</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" label="Search" variant="outlined" hide-details single-line clearable
          @click:clear="handleClearSearch" @input="handleOnSearch">
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="success" dark v-bind="props">
              <SquarePlusIcon size="18" color="green" />
              <b>New AccountId</b>
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
                      <v-select
                          v-model="editedItem.team"
                          :items="['admin', 'seo-1', 'seo-2', 'seo-3', 'seo-4', 'seo-5', 'seo-6']"
                          label="Team"
                          density="comfortable"
                          :rules="[validateTeam]"
                      ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.account_id" label="Account ID" density="comfortable" :rules="[validateAccountID]"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.email" label="Email" density="comfortable" :rules="[validateEmail]" clearable></v-text-field>
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
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}
</style>
