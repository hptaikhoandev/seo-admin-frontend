import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useContentStore = defineStore({
  id: 'content',
  state: () => ({
    content: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchContent({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/contents`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.content = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error =error.message
      } finally {
        this.loading = false
      }
    },
    async deleteContent(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/contents/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.content = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error =error.message
      } finally {
        this.loading = false
      }
    },
    async createContent({body, userId}) {
      this.loading = true
      const params = { body, userId }
      try {
        const response = await axios.post(`${baseUrl}/contents`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.content = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error =error.message
      } finally {
        this.loading = false
      }
    },
    async updateContent({id, body, userId }) {
      this.loading = true
      const params = { id, body, userId }
      try {
        const response = await axios.put(`${baseUrl}/contents/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.content = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error =error.message
      } finally {
        this.loading = false
      }
    },
  }
});
