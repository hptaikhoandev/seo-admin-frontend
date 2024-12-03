<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';
import { usePhoneStore } from '@/stores/modules/phone/phone';
import { useMessageStore } from '@/stores/modules/message/message';
import { useDomainStore } from '@/stores/modules/domain/domain';
import DomainToCFStep1 from './../domainToCFStep1/DomainToCFStep1.vue';
import DomainToCFStep2 from './../domainToCFStep2/DomainToCFStep2.vue';
import DomainToCFStep3 from '../domainToCFStep3/DomainToCFStep3.vue';


export default defineComponent({
  name: 'DomainToCF',
  components: {
    DomainToCFStep1,
    DomainToCFStep2,
    DomainToCFStep3,
  },
  data() {
    return {
      domainStore: useDomainStore,
      isSSL: false,
      isVisibleStep2: true,
      isVisibleStep3: true,
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
  },
  created() {
    this.fetchData();

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

  <DomainToCFStep1 />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <DomainToCFStep2 v-if="isVisibleStep2" />
  <v-divider class="my-4" inset vertical></v-divider>

  <DomainToCFStep3 v-if="isVisibleStep3" />
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
