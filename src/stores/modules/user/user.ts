import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const bearerToken = 'Bearer ' + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNzI0NDQzNTM3LCJleHAiOjE3MjQ0ODY3Mzd9.ynCTq1ImUmD4h6ZpZ7EaMy43nvDga8vqUURlPdAZDDI`;
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUser({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/users`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.user = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteUser(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/users/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.user = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createUser({name, email, password, roleId}) {
      this.loading = true
      const params = { name, email, password, roleId }
      try {
        const response = await axios.post(`${baseUrl}/users`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.user = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateUser({id, name, email, password, roleId }) {
      this.loading = true
      const params = { id, name, email, password, roleId }
      try {
        const response = await axios.put(`${baseUrl}/users/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.user = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
