<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import { useDomainFromStore } from '@/stores/modules/domainFrom/domainFrom';
import { useDomainToStore } from '@/stores/modules/domainTo/domainTo';
import { useRedirectStore } from '@/stores/modules/redirect/redirect';

export default defineComponent({
  name: 'RedirectStep2',
  components: {
    //
  },
  data() {
    return {
      domainFromStore: useDomainFromStore(),
      domainToStore: useDomainToStore(),
      redirectStore: useRedirectStore(),
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('body'),
      sortDesc: ref(false),
      selected: ref([]),
      headers: [
        { title: 'NAME', key: 'name' },
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
    // 
  },
  created() {
    //
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Message' : 'Edit Message'
    },
    showStept2(): boolean {
      const storeFrom = useDomainFromStore();
      const storeTo = useDomainToStore();
      const storeRedirect = useRedirectStore();
      return (storeFrom.domain.length > 0 && storeTo.domain.length > 0) || (storeRedirect.redirectType !== 'Domains to domains Redirect' && storeRedirect.isValidDomainRedirectFrom && storeRedirect.isValidDomainRedirectTo);
    },

  },
  watch: {

    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    async submitStep2() {
      this.close();
      this.loading = true;
      try {
        const redirectType = this.redirectStore.redirectType;
        const domainRedirectFrom = this.redirectStore.domainRedirectFrom;
        const domainRedirectTo = this.redirectStore.domainRedirectTo;
        const domainFrom = this.domainFromStore.domain;
        const domainTo = this.domainToStore.domain;

        const user = ref(null);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.user && parsedUser.user.token) {
            user.value = jwtDecode(parsedUser.user.token);
          }
        }
        let requestData = {};
        if (['Wildcard Redirect', 'Dynamic Segment Redirect'].includes(redirectType)) {
          requestData = {
            team: user.value.roleId,
            redirect_type: redirectType,
            domain_from: [domainRedirectFrom] as Array<string>,
            domain_to: [domainRedirectTo] as Array<string>,
          };
        }
        if (['Domains to domains Redirect'].includes(redirectType)) {
          requestData = {
            team: user.value.roleId,
            redirect_type: redirectType,
            domain_from: domainFrom,
            domain_to: domainTo,
          };
        }

        console.log('===>requestData', requestData);
        await this.redirectStore.addListDomainsToCloudflare(requestData);
        let dataResult = await this.redirectStore.domain;
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

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  }
});

</script>
<template>
  <v-toolbar flat v-if="showStept2">
    <v-toolbar-title>
      Step 2: Submit to CloudFlare
      <v-btn class="text-white mx-2" :style="{ backgroundColor: '#6A8DBA' }" @click="submitStep2">
        Submit
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
</template>

<style>
/* .custom-spacing .v-label {
  margin-bottom: 25px;
} */
</style>
