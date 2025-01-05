<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import { useDestroySiteStore } from '@/stores/modules/destroySite/destroySite';

export default defineComponent({
  name: 'DestroySiteStep2',
  components: {
    //
  },
  data() {
    return {
      destroySiteStore: useDestroySiteStore(),
      dialog: false,
      dialogDelete: false,
      search: ref(''),
      sortBy: ref('body'),
      sortDesc: ref(false),
      selected: ref([]),
      showResult: false,
      resultMessage: {
        success: {
          count: 0,
          messages: [] as string[]
        },
        fail: {
          count: 0,
          messages: [] as string[]
        },
      },
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
      const store = useDestroySiteStore();
      if (store.domain.length == 0) {
        this.items.splice(0, this.items.length);
        store.domain.splice(0, store.domain.length);
      }
      return (store.domain.length > 0) && (store.serverIP !== '' || store.isServerIPValid);
    },

  },
  watch: {

    dialog(val) {
      val || this.close()
    },
    resultMessage(newVal, oldVal) {
      console.log(`resultMessage changed from ${oldVal} to ${newVal}`);
      // Thực hiện các tác vụ khác khi giá trị thay đổi
    },
  },
  methods: {
    async submitStep2() {
      this.close();
      this.loading = true;
      this.showResult = false;
      try {
        const serverIP = this.destroySiteStore.serverIP;
        const domains = this.destroySiteStore.domain.map(domain => domain.name);

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
        const user = jwtDecode(parsedUser.user.token);
        const userRole = (user as any).roleId;
        if (!(user && userRole)) return [];

        const requestData: { team: number; server_ip: string; domains: string[] } = {
          team: userRole,
          server_ip: serverIP,
          domains: [],
        };

        // Thêm vòng lặp for...of đảm bảo thực thi tuần tự
        for (const [index, domain] of domains.entries()) {
          console.log(`Processing domain ${index + 1}: ${domain}`);
          
          // Chuẩn bị requestData cho từng domain
          requestData.domains = [domain];
          
          try {
            // Gọi API một cách tuần tự
            const ketqua = await this.destroySiteStore.addListDomainsToDestroySites(requestData);
            
            // Hiển thị kết quả
            this.showResult = true;
            console.log(`====> ${index + 1}: ${ketqua.result.success}`);

            if (ketqua.result.success.count !== 0) {
              this.resultMessage.success.count += 1;
              this.resultMessage.success.messages.push(ketqua.result.success.messages[0]);
            }
            if (ketqua.result.fail.count !== 0) {
              this.resultMessage.fail.count += 1;
              this.resultMessage.fail.messages.push(ketqua.result.fail.messages[0]);
            }
          } catch (error) {
            console.error(`Error processing domain ${index + 1}: ${domain}`, error);
          }
        }
        this.playAudio();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
        this.showResult = true;
      }
    },
    playAudio() {
      const audio = new Audio('/task_xoa_success.mp3'); 
      audio.play().catch(err => console.error("Error playing audio:", err)); 
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
      Step 2: submit to server
      <v-btn class="text-white mx-2" :style="{ backgroundColor: '#6A8DBA' }" @click="submitStep2" :disabled="loading">
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="20"
          class="mr-2"
        >
        </v-progress-circular>
        Submit
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
  <!-- Hiển thị kết quả chỉ sau khi gọi API xong (khi loading là false) -->
  <v-text v-if="showResult">
    <span class="text-success font-bold">Success: {{ resultMessage.success.count }}</span>
    <span v-if="resultMessage.fail.count !== 0" class="text-error font-bold">, Fail: {{ resultMessage.fail.count }}</span>
  </v-text>
  <v-text v-if="showResult">
    <ul>
      <li v-for="(message, index) in resultMessage.success.messages" :key="index" class="text-success font-bold">
        {{ message }}
      </li>
    </ul>
    <ul>
      <li v-for="(message, index) in resultMessage.fail.messages" :key="index" class="text-error font-bold">
        {{ message }}
      </li>
    </ul>
  </v-text>
</template>
<style>
/* .custom-spacing .v-label {
  margin-bottom: 25px;
} */
</style>
