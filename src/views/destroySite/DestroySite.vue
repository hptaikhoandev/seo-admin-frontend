<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';
import { useMutilSiteStore } from '@/stores/modules/mutilSite/mutilSite';
import DestroySiteStep1 from './../destroySiteStep1/DestroySiteStep1.vue';
import DestroySiteStep2 from './../destroySiteStep2/DestroySiteStep2.vue';


export default defineComponent({
  name: 'DestroySite',
  components: {
    DestroySiteStep1,
    DestroySiteStep2,
  },
  data() {
    return {
      mutilSiteStore: useMutilSiteStore,
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
    // 
  },
  created() {
    //

  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Phone' : 'Edit Phone'
    },
    // showStep2() {
    //   const store = useMutilSiteStore();
    //   return store.isValidServerIP && store.isDomainValid;
    // },
    showStept2(): boolean {
      const store = useMutilSiteStore();
      console.log('ddddd', store.domain);
      return (store.domain.length > 0);
    },

  },
  watch: {
    //
  },
  methods: {
    //
  }
});

</script>
<template>

  <DestroySiteStep1 />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <DestroySiteStep2 />
  <v-divider class="my-4" inset vertical></v-divider>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
