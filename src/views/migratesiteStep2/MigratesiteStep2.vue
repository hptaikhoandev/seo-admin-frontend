<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import { useMigratesiteStore } from '@/stores/modules/migratesite/migratesite';

export default defineComponent({
  name: 'MigratesiteStep2',
  components: {
    //
  },
  data() {
    return {
      migrateStore: useMigratesiteStore(),
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
        const sourceIP = this.migrateStore.source_ip;
        const targetIP = this.migrateStore.target_ip;
        const domainNameSource = this.migrateStore.domainNameSource;
        // const domainNameTarget = this.migrateStore.domainNameTarget;

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
        const user = jwtDecode(parsedUser.user.token);
        const userRole = (user as any).roleId;
        if (!(user && userRole)) return [];

        const requestData = {
          team: userRole,
          source_ip: sourceIP,
          target_ip: targetIP,
          source_domain: domainNameSource,
          // target_domain: domainNameTarget,
        };

        const ketqua = await this.migrateStore.migrateSite(requestData);
        // Hiển thị kết quả
        this.showResult = true;
        if (ketqua.result.success.count !== 0) {
          this.resultMessage.success.count += 1;
          this.resultMessage.success.messages.push(ketqua.result.success.messages[0]);
        }
        if (ketqua.result.fail.count !== 0) {
          this.resultMessage.fail.count += 1;
          this.resultMessage.fail.messages.push(ketqua.result.fail.messages[0]);
        }
        // Loại trừ những trường hợp lỗi đặc biệt
        const exceptionText = this.resultMessage.fail.messages[0] as string;
        if (exceptionText.includes('mysql: Deprecated program name. It will be removed in a future release, use')) {
          this.resultMessage.fail.count = this.resultMessage.fail.count -1;
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
      const audio = new Audio('/task_tao_website_success.mp3'); 
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
  <v-toolbar flat>
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
