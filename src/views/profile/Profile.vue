<script lang="ts">
import { defineComponent, ref, computed, type Ref } from 'vue';
import { useClonesiteStore } from '@/stores/modules/clonesite/clonesite';
import '@mdi/font/css/materialdesignicons.css';
import { useAuthStore } from '@/stores/modules/auth/auth';
import { useUsersStore } from '@/stores/modules/auth/authUser';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const usersStore = useUsersStore();

const userData = JSON.parse(localStorage.getItem('user') ?? '{}').user ?? null;

const roleUser: string = userData?.roleId ?? 'unknown';
const emailUser: string = userData?.email ?? '';



export default defineComponent({
  name: 'Profile',
  components: {
 
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
    
      loading: ref(false),

      // ✅ Form Fields
      email: emailUser,
      password: ref(''),
      newPassword: ref(''),
      valid: ref(false),
      showPassword: ref(false),
      showNewPassword: ref(false),

      resultMessage: ref<any>(),
      showResult: ref(false),

    };
  },

  computed: {
    showStep2() {
      const store = useClonesiteStore();
      return store.isServerIPValid && store.isDomainNameSourceValid && store.isDomainNameTargetValid;
    },
  },

  methods: {
    validateForm() {
      // Custom validation logic can go here
      console.log('Email:', this.email);
      console.log('Password:', this.password);
      console.log('New Password:', this.newPassword);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    async save() {
      this.loading = true;
      try {
        const result = await usersStore.updateUserInfo(this.email, this.password, this.newPassword);
       
        this.showResult = true;
        this.resultMessage = result; 
        
      } catch (error) {
        console.error('Update failed:', error);
      }
      
      // this.fetchData();
     
      this.loading = false;
    },
  },
});

</script>

<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <!-- Email Field -->
      <v-text-field 
        v-model="email" 
        label="Email" 
        type="email" 
        :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Enter a valid email']"
        required
        disabled
      ></v-text-field>

      <!-- Password Field with Show/Hide Icon -->
      <v-text-field 
        v-model="password" 
        :type="showPassword ? 'text' : 'password'"
        label="Password" 
        @click:append-inner="showPassword = !showPassword"
        clearable
        required
        :rules="[
          v => !!v || 'Password is required', 
          v => v.length >= 6 || 'Password must be at least 6 characters'
        ]"
      >
        <span className="show-password" @click="togglePasswordVisibility">
        <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
        </span>
      </v-text-field>

      <!-- New Password Field with Show/Hide Icon -->
      <v-text-field 
        v-model="newPassword" 
        :type="showNewPassword ? 'text' : 'password'"
        label="New Password" 
        @click:append-inner="showNewPassword = !showNewPassword"
        clearable
        required
        :rules="[
          v => !!v || 'New Password is required', 
          v => v.length >= 6 || 'New Password must be at least 6 characters',
          v => !/\s/.test(v) || 'New Password cannot contain spaces', 
          v => /^[A-Za-z0-9!@#$%^&*()_+=-]+$/.test(v) || 'New Password cannot contain Vietnamese characters',
          v => v !== password || 'New Password must be different from the current password'
        ]"
      >
        <span className="show-password" @click="toggleNewPasswordVisibility">
          <i :class="showNewPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
        </span>
      </v-text-field>

      <v-btn :disabled="!valid" color="primary" class="mt-4" @click="save">
        Submit
      </v-btn>
    </v-form>
  </v-container>
  <!-- Hiển thị kết quả chỉ sau khi gọi API xong (khi loading là false) -->
  <v-text v-if="showResult">
  
    <ul v-if="resultMessage.success === true && resultMessage.data.message">
    <li :key="`success-1`" class="text-success font-bold">
      {{ resultMessage.data.message }}
    </li>
  </ul>

  <ul v-if="resultMessage.success === false && resultMessage.error">
    <li :key="`fail-1`" class="text-error font-bold">
      {{ resultMessage.error }}
    </li>
  </ul>
  </v-text>

</template>
<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}
.show-password  {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 12px;
}
</style>
