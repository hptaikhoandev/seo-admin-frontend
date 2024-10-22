import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useEmailStore = defineStore({
  id: 'email',
  state: () => ({
    email: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchEmail({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/emails`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.email = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteEmail(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/emails/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.email = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createEmail({email, userId}) {
      this.loading = true
      const params = { email, userId }
      try {
        const response = await axios.post(`${baseUrl}/emails`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.email = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateEmail({id, email, userId }) {
      this.loading = true
      const params = { id, email, userId }
      try {
        const response = await axios.put(`${baseUrl}/emails/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.email = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
