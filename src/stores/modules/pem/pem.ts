import { defineStore } from 'pinia';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const bearerToken = 'Bearer ' + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNzI0NDQzNTM3LCJleHAiOjE3MjQ0ODY3Mzd9.ynCTq1ImUmD4h6ZpZ7EaMy43nvDga8vqUURlPdAZDDI`;
export const usePemStore = defineStore({
  id: 'pem',
  state: () => ({
    pem: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPem({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/pems`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.pem = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deletePem(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/pems/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.pem = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createPem({pem, server_ip}) {
      this.loading = true
      const params = { pem, server_ip }
      try {
        const response = await axios.post(`${baseUrl}/pems`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.pem = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updatePem({id, pem, server_ip }) {
      this.loading = true
      const params = { id, pem, server_ip }
      try {
        const response = await axios.put(`${baseUrl}/pems/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
        })
        this.pem = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
