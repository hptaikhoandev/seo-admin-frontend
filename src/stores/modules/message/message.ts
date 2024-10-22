import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useMessageStore = defineStore({
  id: 'message',
  state: () => ({
    message: [],
    total: 0,
    loading: false,
    error: null,
    selectedMessages: [],
  }),
  actions: {
    async fetchMessage({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/messages`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.message = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteMessage(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/messages/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.message = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createMessage({body, userId}) {
      this.loading = true
      const params = { body, userId }
      try {
        const response = await axios.post(`${baseUrl}/messages`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.message = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateMessage({id, body, userId }) {
      this.loading = true
      const params = { id, body, userId }
      try {
        const response = await axios.put(`${baseUrl}/messages/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.message = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
