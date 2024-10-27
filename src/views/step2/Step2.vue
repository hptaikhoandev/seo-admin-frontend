<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useMessageStore } from '@/stores/modules/message/message';
import { useDomainStore } from '@/stores/modules/domain/domain';
import moment from 'moment';

export default defineComponent({
  name: 'Step2',
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
        { title: 'DOMAIN', key: 'domain' },
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
    items(newItems) {
      this.domainStore.domainExport = newItems
    },
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
    async submitStep2() {
      

      this.loading = true;
      try {
        const serverIP = this.domainStore.serverIP;
        const isSSL = this.domainStore.isSSL ? "flexible" : "none"; // Thiết lập "flexible" nếu isSSL là true, "none" nếu là false
        const domainList = this.domainStore.domain?.map(domain => domain.name); // Lấy danh sách tên miền từ các đối tượng trong `domain`

        const requestData = {
          team: "seo-3",
          server_ip: serverIP,
          ssl_type: isSSL,
          domains: domainList
        };

        const domainStore = useDomainStore();
        await domainStore.addListDomainsToCloudflare(requestData);
        let dataResult = await domainStore.domainNS;


        await console.log("=== data===>", domainStore.domainNS);


        const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
        dataResult = await dataResult.map(item => ({
          ...item,
          createdAt: currentTime,
          updatedAt: currentTime,
          status: 'Pending Nameserver Updates'
        }));


        this.items = await dataResult;
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
  <v-data-table-server
    :headers="headers" 
    :items="items" 
    item-value="body" 
    :items-per-page="itemsPerPage"
    :items-length="totalItems" 
    :page.sync="page"
    hide-default-footer 
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange" 
    @update:options="handleSortBy" 
    hover 
    height="200"
    :loading="loading"
    @update:modelValue="handleSelectionChange"
  >
    <template v-slot:top>
      <v-toolbar :style="{ height: 'auto', alignItems: 'center' }">
        <v-toolbar-title :style="{ height: 'auto', display: 'flex', alignItems: 'center' }">
          Step 2: Submit to CloudFlare
          <v-btn class="text-white mx-2" :style="{ backgroundColor: '#6A8DBA' }" @click="submitStep2">
            Submit
          </v-btn>
        </v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
    </template>
  </v-data-table-server>
</template>
<style>
/* .custom-spacing .v-label {
  margin-bottom: 25px;
} */
</style>
