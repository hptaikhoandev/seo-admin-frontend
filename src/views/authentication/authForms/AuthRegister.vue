<script lang="ts">
import { defineComponent, ref } from 'vue';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/modules/auth/auth';
import { Form, ErrorMessage, useForm } from 'vee-validate';

export default defineComponent({
  name: 'AuthRegister',
  components: {
    Form,
    EyeInvisibleOutlined,
    EyeOutlined
  },
  data() {
    return {
      show1: ref(false),
      valid: ref(false),
      password: ref(''),
      name: ref(''),
      email: ref(''),
      passwordRules: ref([
        (v: string) => !!v || 'Password is required',
        (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters'
      ]),
      nameRules: ref([(v: string) => !!v || 'Name is required']),
      emailRules: ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']),
    };
  },
  methods: {
    async validate(values: any) {
      const { resetForm, validate, errors } = useForm();
      console.log('validate===>');
      // Validate all fields
      const isValid = await validate();
      if (isValid) {
        const authStore = useAuthStore();
        return authStore.register(this.name, this.email, this.password).catch((error) => console.log(error));
      } else {
        console.log('Form has validation errors', errors.value);
      }
    },
  }
});
</script>
<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Sign up</h3>
    <router-link to="/auth/login" class="text-primary text-decoration-none">Already have an account?</router-link>
  </div>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <div class="mb-6">
      <v-label>Name*</v-label>
      <v-text-field
        v-model="name"
        :rules="nameRules"
        hide-details="auto"
        required
        variant="outlined"
        class="mt-2"
        color="primary"
        placeholder="Doe"
      ></v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Email Address*</v-label>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        placeholder="demo@company.com"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Password</v-label>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        placeholder="*****"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="mt-2"
      >
        <template v-slot:append-inner>
          <v-btn color="secondary" icon rounded variant="text">
            <EyeInvisibleOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == false" @click="show1 = !show1" />
            <EyeOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <h6 class="text-caption">
        By Signing up, you agree to our
        <router-link to="/auth/register" class="text-primary link-hover font-weight-medium">Terms of Service </router-link>
        and
        <router-link to="/auth/register" class="text-primary link-hover font-weight-medium">Privacy Policy</router-link>
      </h6>
    </div>
    <v-btn color="primary" :loading="isSubmitting" block class="mt-5" variant="flat" size="large" :disabled="valid" type="submit">
      Create Account
    </v-btn>
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>



<style lang="scss">
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
