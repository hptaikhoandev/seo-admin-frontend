<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';
import { useMutilSiteStore } from '@/stores/modules/mutilSite/mutilSite';
import MultiSiteStep1 from './../multiSiteStep1/MultiSiteStep1.vue';
import MultiSiteStep2 from './../multiSiteStep2/MultiSiteStep2.vue';


export default defineComponent({
  name: 'MultiSite',
  components: {
    MultiSiteStep1,
    MultiSiteStep2,
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

  <MultiSiteStep1 />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <MultiSiteStep2 />
  <v-divider class="my-4" inset vertical></v-divider>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
