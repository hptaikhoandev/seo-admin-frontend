<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { usePhoneStore } from '@/stores/modules/phone/phone';
import { useMessageStore } from '@/stores/modules/message/message';
import PhoneForSending from './../phonesForSending/PhoneForSending.vue';
import MessageForSending from '../messagesForSending/MessageForSending.vue';


export default defineComponent({
  name: 'SendPhone',
  components: {
    PhoneForSending,
    MessageForSending,
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('vendor'),
      sortDesc: ref(false),
      headers: [
        { title: 'ID', align: 'start', sortable: false, key: 'id', },
        { title: 'NUMBER', key: 'number' },
        { title: 'VENDOR', key: 'vendor' },
        { title: 'USER ID', key: 'userId' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
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
      itemsPerPage: ref(10),
      totalItems: ref(110),
      loading: ref(false),
    };
  },

  mounted() {
    // this.fetchData();
    const phoneStore = usePhoneStore();
    console.log("==>001", phoneStore.selectedPhones);
  },
  created() {
    this.fetchData()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Phone' : 'Edit Phone'
    },
  },
  watch: {
    //
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
    async sendSMS() {
      this.loading = true;
      try {
        const phoneStore = usePhoneStore();
        const messageStore = useMessageStore();
        await phoneStore.sendSMS(Object.values(phoneStore.selectedPhones), Object.values(messageStore.selectedMessages));
      } catch (error) {
        console.error("Error send sms:", error);
      } finally {
        this.loading = false;
      }
    },

    handleSendPhone() {
      const phoneStore = usePhoneStore();
      const messageStore = useMessageStore();
      console.log("Selected phone items submit:", Object.values(phoneStore.selectedPhones));
      console.log("Selected message items submit:", Object.values(messageStore.selectedMessages));
    },
  }
});

</script>
<template>

  <PhoneForSending />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <MessageForSending />
  <v-divider class="my-4" inset vertical></v-divider>

  <v-toolbar flat>
    <v-toolbar-title>
      Step 3: Export to Excel
      <v-btn class="text-white mx-2" :style="{ backgroundColor: '#7DA77D' }" @click="sendSMS">
        Export
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
