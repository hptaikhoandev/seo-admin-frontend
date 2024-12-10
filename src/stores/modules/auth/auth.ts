import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}`;
export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null,
  }),
  actions: {
    resetState() {
      this.$reset(); // Reset toàn bộ state về trạng thái mặc định
    },
    async register(name: string, email: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/auth/register`, { name, email, password });
      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/auth/login');
    },
    async login(email: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/auth/login`, { email, password });

      // update pinia state
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      // redirect to previous url or default to home page
      router.push('/');
      

    },
    async logout() {
      this.user = null;
      localStorage.removeItem('user');
      // Điều hướng đến trang login
      router.push('/auth/login');   
      // // Xóa toàn bộ dữ liệu trong localStorage
      // localStorage.clear();

      // // Xóa toàn bộ dữ liệu trong sessionStorage
      // sessionStorage.clear();
    }
  }
});
