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
    returnUrl: null
  }),
  actions: {
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
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/dashboard');
    },
    async logout() {
      // Xóa toàn bộ dữ liệu trong localStorage
      localStorage.clear();
    
      // Xóa toàn bộ dữ liệu trong sessionStorage
      sessionStorage.clear();
    
      // Xóa tất cả cookie
      document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    
      // Xóa cache nếu có
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        for (const key of cacheKeys) {
          await caches.delete(key);
        }
      }
    
      // Reset thông tin người dùng
      this.user = null;
    
      // Điều hướng đến trang login
      router.push('/auth/login');
    }
    
  }
});
