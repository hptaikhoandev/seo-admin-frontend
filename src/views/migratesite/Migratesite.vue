<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';
import { useMigratesiteStore } from '@/stores/modules/migratesite/migratesite';
import MigratesiteStep1 from './../migratesiteStep1/MigratesiteStep1.vue';
import MigratesiteStep2 from './../migratesiteStep2/MigratesiteStep2.vue';


export default defineComponent({
  name: 'Migratesite',
  components: {
    MigratesiteStep1,
    MigratesiteStep2,
  },
  data() {
    return {
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
    showStep2() {
      const store = useMigratesiteStore();
      return store.isServerIPValid && store.isDomainNameSourceValid;
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

  <MigratesiteStep1 />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <MigratesiteStep2 v-if="showStep2" />
  <v-divider class="my-4" inset vertical></v-divider>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
