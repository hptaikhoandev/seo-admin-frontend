import { defineStore } from 'pinia';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
  id: 'Authuser',
  state: () => ({
    users: {}
  }),
  actions: {
    getAll() {
      this.users = { loading: true };
      fetchWrapper
        .get(baseUrl)
        .then((users) => (this.users = users))
        .catch((error) => (this.users = { error }));
    },
    async updateUserInfo(email: string, oldPassword: string, password: string) {
      const currentUser = localStorage.getItem('user');
      const userObj = currentUser ? JSON.parse(currentUser) : null;
      const bearerToken = 'Bearer ' + userObj.user.token;
      try {
        const response = await axios.post(`${baseUrl}/user-profile`, { email, oldPassword, password },
          { 
            headers: {
              Authorization: bearerToken,
            },
            timeout: 7200000,
          }
        );
        if (response.data) {
          return { success: true, data: response.data };
        }
      } catch (error) {
        // Extract error message safely
        const errorMessage = (error as any)?.response?.data?.error || (error as Error)?.message || 'An unknown error occurred';
        return { success: false, error: errorMessage };
      }
      // redirect to previous url or default to home page

    },
  }
});
