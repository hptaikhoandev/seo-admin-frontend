<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';
import { useDomainStore } from '@/stores/modules/domain/domain';
import RedirectStep1 from './../redirectStep1/RedirectStep1.vue';
import RedirectStep1DomainsToDomains from './../redirectStep1DomainsToDomains/RedirectStep1DomainsToDomains.vue';
import RedirectStep2 from '../redirectStep2/RedirectStep2.vue';


export default defineComponent({
  name: 'RedirectToCF',
  components: {
    RedirectStep1,
    RedirectStep1DomainsToDomains,
    RedirectStep2,
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
    // 
  },
  created() {
    // 

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
    //
  }
});

</script>
<template>

  <RedirectStep1 />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <RedirectStep1DomainsToDomains />
  <v-divider class="my-4" inset vertical></v-divider>

  <RedirectStep2 />
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
