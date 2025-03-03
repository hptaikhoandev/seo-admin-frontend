import { defineStore } from 'pinia';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const bearerToken = 'Bearer ' + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNzI0NDQzNTM3LCJleHAiOjE3MjQ0ODY3Mzd9.ynCTq1ImUmD4h6ZpZ7EaMy43nvDga8vqUURlPdAZDDI`;
export const useSubDomainStore = defineStore({
  id: 'subDomain',
  state: () => ({
    server: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSubDomains({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/subdomains`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        const servers = response.data.data;
        this.server = await servers;
        this.total = response.data.total;
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
   
  }
});
