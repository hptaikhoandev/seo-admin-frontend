<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRedirectStore } from '@/stores/modules/redirect/redirect';
import moment from 'moment';
import { HistoryIcon } from 'vue-tabler-icons';

export default defineComponent({
  name: 'RedirectStep1',
  components: {
    //
  },
  data() {
    return {
      is301: true,
      domainRedirectFrom:'',
      domainRedirectTo:'',
      redirectType: 'Wildcard Redirect',
      showDialog: false,
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('vendor'),
      sortDesc: ref(false),
      headers: [
        { title: 'NAME', key: 'name' },
        { title: 'VALUE', key: 'value' },
  
        { title: 'ACTIONS', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        value: '',
        zone_id: '',
        rule_id: '',
        createdAt: '',
        updatedAt: '',
      },
      defaultItem: {
        id: 0,
        name: '',
        value: '',
        zone_id: '',
        rule_id: '',
        createdAt: '',
        updatedAt: '',
      },
      items: ref([]) as Ref<any[]>,
      page: ref(1),
      itemsPerPage: ref(5),
      totalItems: ref(110),
      loading: ref(false),
      listDomain: '',
      ruleItems: ref([]) as Ref<any[]>,
      isValidListDomain: false,
      resultMessage: {
        success: 0,
        fail: {
          count:0,
          messages: []
        },
      },
      showResult: false,
    };
  },

  mounted() {
    // this.fetchData();
    const store = useRedirectStore();
  
    // Ensure the value is set correctly
    this.redirectType = store.redirectType;
  },
  created() {
    //
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Domain' : 'Edit Domain'
    },
    isNameValid() {
      return this.validateDomain(this.editedItem.name) === true;
    },
    showDomainRedirect(): boolean {
      return this.redirectType !== 'Domains to domains Redirect';
    },
  },
  watch: {
    domainRedirectFrom(newDomainRedirectFrom) {
      const store = useRedirectStore();
      store.domainRedirectFrom = newDomainRedirectFrom;
      store.isValidDomainRedirectFrom = this.validateDomain(newDomainRedirectFrom) === true;
    },
    domainRedirectTo(newDomainRedirectTo) {
      const store = useRedirectStore();
      store.domainRedirectTo = newDomainRedirectTo;
      store.isValidDomainRedirectTo = this.validateDomain(newDomainRedirectTo) === true;
    },
    redirectType(newValue, oldValue) {
      const store = useRedirectStore();
      store.redirectType = newValue;
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    listDomain(value) {
      // Trigger validation on model change
      const isValid = (this.$refs.listDomainField as any).validate();
      if (isValid) {
        this.isValidListDomain = true;
      } else {
        this.isValidListDomain = false;
      }
    }
  },
  methods: {
    reset() {
      this.items.splice(0, this.items.length);
    },
    openDialogHistory() {
      console.log('===>openDialogHistory');
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    validateIPAddress(value) {
      const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
      return ipPattern.test(value) || 'Please enter a valid IP address (e.g., 54.243.100.131)';
    },
    validateDomain(value) {
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]*\.)?[a-zA-Z0-9][a-zA-Z0-9-_]*\.[a-zA-Z]{2,11}?$/;
      return domainRegex.test(value) || 'Please enter a valid domain name';
    },
    validateDomainList(value) {
      // Biểu thức chính quy để kiểm tra nhiều tên miền hợp lệ, phân cách bởi dấu phẩy
      const domainRegex = /^([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)(,\s*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)*$/;

      // Kiểm tra giá trị có khớp với regex không
      return domainRegex.test(value) || 'Please enter valid domain names, e.g., a.com, b.net';
    },
    deleteItem(item) {
      this.editedIndex = this.ruleItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async searchDomain() {
      const user = localStorage.getItem('user');
      const userObj = user ? JSON.parse(user) : null;
      const store = useRedirectStore();
      let data = await store.getListRulesFromDomain({team: userObj.user.roleId, domains: this.listDomain});
     
      if(data && data.status === "success") {
        this.ruleItems = data.result.data;
      } else {
        this.ruleItems = [];
      }
      
    },
    checkValidity() {
      const isValid = (this.$refs.listDomainField as any).validate();
      if (isValid) {
        this.isValidListDomain = true;
      } else {
        this.isValidListDomain = false;
      }
    },
    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    async deleteRuleItemConfirm() {
      this.showResult = false;
      this.loading = true;
      try {
        const user = localStorage.getItem('user');
        const userObj = user ? JSON.parse(user) : null;
        const store = useRedirectStore();
        let data = await store.deleteRuleItem({team: userObj.user.roleId, rule_id: this.editedItem.id, zone_id: this.editedItem.zone_id});
        if(data && data.status === "success") {
          this.searchDomain();
        } 
        this.resultMessage = data.result;
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
        this.showResult = true;
      }
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    downloadFile() {
      const fileUrl = 'https://seo-admin.s3.ap-southeast-2.amazonaws.com/domains.txt';
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', 'domains.txt');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error downloading file:', error);
        });
    },
    async importDomains(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      try {
        const fileContent: string | unknown = await this.readFile(file);
        let domainList: string[] = [];

        if (typeof fileContent === 'string') {
          domainList = fileContent
            .split('\n')
            .map(domain => domain.trim())
            .filter(domain => domain);
        }

        // Kiểm tra nếu domainList không rỗng trước khi xử lý
        if (domainList.length > 0) {
          const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
          domainList.forEach(domainName => {
            const nameExists = this.items.some(item => item.name === domainName);
            if (!nameExists) {
              this.items.unshift({
                id: 0,
                name: domainName,
                createdAt: currentTime.toString(),
                updatedAt: currentTime.toString(),
              });
            }
          });
        }        
        event.target.value = null;
      } catch (error) {
        console.error('Error reading file:', error);
      }
    },
    readFile(file) {
      // Return a promise to read the file content
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target) {
            resolve(event.target.result);
          } else {
            reject(new Error("FileReader target is null"));
          }
        };        
        reader.onerror = error => reject(error);
        reader.readAsText(file);
      });
    },
    save() {
      const currentTime = moment().format('DD-MM-YYYY:HH:mm:ss');
      this.editedItem.createdAt = currentTime;
      this.editedItem.updatedAt = currentTime;
      const nameExists = this.items.some(item => item.name === this.editedItem.name);
      if (nameExists && this.editedIndex === -1) {
        this.close();
        return;
      }
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        this.items.unshift(this.editedItem)
      }
      this.close();
    },

  }
});

</script>
<template>
  <v-container class="px-5" :style="{ backgroundColor: '#EEEEEE', borderRadius: '5px', maxWidth: '100%' }">
    <v-row class="pb-0">
      <v-col class="pb-2" :style="{fontSize: '20px'}">
        Step 1: Choice redirect type
      </v-col>
      <v-col cols="2" class="d-flex justify-end">
        <v-btn size="small" :style="{ backgroundColor: '#E0B3FF' }" @click="showDialog=true">
          <HistoryIcon size="15" color="white" />
          History
        </v-btn>
        <!-- Dialog -->
        <v-dialog v-model="showDialog" max-width="800px">
          <v-card>
            <!-- Dialog Title -->
            <v-card-title>
              <span class="text-h6">History Table</span>
              <v-spacer></v-spacer>
              <v-container>
                <v-row>
                  <v-col cols="8">
                    <v-text-field v-model="listDomain" label="Name" density="comfortable"
                    :rules="[validateDomainList]" placeholder="Please enter valid domain names, e.g., a.com, b.net"
                    ref="listDomainField"
                    >
                  </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-btn text @click="searchDomain()" style="height: 56px; display: flex; align-items: center; justify-content: center;">Search</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-text v-if="showResult">
                    <span class="text-success font-bold">Success: {{ resultMessage.success }}</span>
                    <span v-if="resultMessage.fail.count !== 0" class="text-error font-bold">, Fail: {{ resultMessage.fail.count }}</span>
                  </v-text>
                  <v-text v-if="showResult && resultMessage.fail.count !== 0">
                    <ul>
                      <li v-for="(message, index) in resultMessage.fail.messages" :key="index" class="text-error font-bold">
                        {{ message }}
                      </li>
                    </ul>
                  </v-text>
                </v-row>
              </v-container>
            </v-card-title>

            <!-- Dialog Content -->
            <v-card-text>
              <v-data-table-server :headers="headers" :items="ruleItems" item-value="id" :items-per-page="itemsPerPage"
                :items-length="totalItems" :page.sync="page"
                height="200" hover hide-default-footer :loading="loading">
                <template v-slot:item.actions="{ item }" class="scrollable-table">
                  <!-- <EditIcon size="18" color="orange" class="mr-2" style="cursor: pointer;" @click="editItem(item)" /> -->
                  <TrashIcon size="18" color="#FF5252" class="ml-2" style="cursor: pointer;" @click="deleteItem(item)" />
                </template>
              </v-data-table-server>
            </v-card-text>
            <!-- Dialog Actions -->
            <v-card-actions>
              <v-btn text @click="showDialog=false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

    </v-row>
    <v-row class="py-0">
      <v-col cols="4" class="py-0">
        <v-select
          v-model="redirectType"
          label="Redirect Type"
          class="mt-3" 
          :items="['Wildcard Redirect', 'Homepage Redirect', 'Delete Redirect']"
        />
      </v-col>
      <v-col cols="2" class="py-1">
        <v-checkbox
          v-model="is301"
          label="301"
          class="mt-3"
          disabled
        />
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="deleteRuleItemConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.v-field__input {
  margin-top: 10px;
}
</style>
