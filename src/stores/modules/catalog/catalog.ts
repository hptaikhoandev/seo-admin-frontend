import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useCatalogStore = defineStore({
  id: 'catalog',
  state: () => ({
    catalog: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCatalog({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/catalogs`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.catalog = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteCatalog(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/catalogs/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.catalog = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createCatalog({number, vendor, userId}) {
      this.loading = true
      const params = { number, vendor, userId }
      try {
        const response = await axios.post(`${baseUrl}/catalogs`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.catalog = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateCatalog({id, number, vendor, userId }) {
      this.loading = true
      const params = { id, number, vendor, userId }
      try {
        const response = await axios.put(`${baseUrl}/catalogs/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.catalog = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
