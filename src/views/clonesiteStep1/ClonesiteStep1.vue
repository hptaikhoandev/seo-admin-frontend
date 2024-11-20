<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useClonesiteStore } from '@/stores/modules/clonesite/clonesite';
import moment from 'moment';
import { Loader2Icon, ReloadIcon } from 'vue-tabler-icons';
import { RedoOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ClonesiteStep1',
  components: {
    //
  },
  data() {
    return {
      serverIP: '',
      domainNameSource: '',
      domainNameTarget: '',
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('vendor'),
      sortDesc: ref(false),
      headers: [
        { title: 'NAME', key: 'name' },
        { title: 'CREATED AT', key: 'createdAt' },
        { title: 'UPDATED AT', key: 'updatedAt' },
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        name: '',
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
    //
  },
  computed: {
    //
  },
  watch: {
    serverIP(newServerIP) {
      console.log('serverIP:', newServerIP);
      const store = useClonesiteStore();
      store.serverIP = newServerIP;
      store.isServerIPValid = this.validateIPAddress(newServerIP) === true;
    },
    domainNameSource(newDomainNameSource) {
      console.log('domainName:', newDomainNameSource);
      const store = useClonesiteStore();
      store.domainNameSource = newDomainNameSource;
      store.isDomainNameSourceValid = this.validateDomain(newDomainNameSource) === true && newDomainNameSource !== store.domainNameTarget;
    },
    domainNameTarget(newDomainNameTarget) {
      console.log('domainName:', newDomainNameTarget);
      const store = useClonesiteStore();
      store.domainNameTarget = newDomainNameTarget;
      store.isDomainNameTargetValid = this.validateDomain(newDomainNameTarget) === true && newDomainNameTarget !== store.domainNameSource;
    },
  
  },
  methods: {
    validateIPAddress(value) {
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value) || 'Please enter a valid IP address (e.g., 54.243.100.131)';
    },
    validateDomain(value) {
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]*\.)?[a-zA-Z0-9][a-zA-Z0-9-_]*\.[a-zA-Z]{2,11}?$/;
      return domainRegex.test(value) || 'Please enter a valid domain name';
    },
  }
});

</script>
<template>
  <v-container class="px-5" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="pb-0">
      <v-col class="pb-2" :style="{fontSize: '20px'}">
        Step 1: input ServerIP, Domain
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col cols="3" class="py-0">
        <v-text-field v-model="serverIP" label="Server IP chứa website" placeholder="Enter Server IP" class="mt-3"
          :rules="[validateIPAddress]" />
      </v-col>
      <v-col cols="3" class="py-0">
        <v-text-field v-model="domainNameSource" label="Domain name source" placeholder="Enter Domain source" class="mt-3"
          :rules="[validateDomain]" />
      </v-col>
      <v-col cols="3" class="py-0">
        <v-text-field v-model="domainNameTarget" label="Domain name target" placeholder="Enter Domain target" class="mt-3"
          :rules="[validateDomain]" />
      </v-col>
    </v-row>
  </v-container>


</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
