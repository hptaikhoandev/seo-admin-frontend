<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';
import { useClonesiteStore } from '@/stores/modules/clonesite/clonesite';
import ClonesiteStep1 from './../clonesiteStep1/ClonesiteStep1.vue';
import ClonesiteStep2 from './../clonesiteStep2/ClonesiteStep2.vue';


export default defineComponent({
  name: 'Clonesite',
  components: {
    ClonesiteStep1,
    ClonesiteStep2,
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
      const store = useClonesiteStore();
      return store.isServerIPValid && store.isDomainNameSourceValid && store.isDomainNameTargetValid;
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

  <ClonesiteStep1 />
 
  <v-divider class="my-4" inset vertical></v-divider>

  <ClonesiteStep2 v-if="showStep2" />
  <v-divider class="my-4" inset vertical></v-divider>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
