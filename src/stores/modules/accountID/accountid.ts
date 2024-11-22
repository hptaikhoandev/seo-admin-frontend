import { defineStore } from 'pinia';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const bearerToken = 'Bearer ' + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNzI0NDQzNTM3LCJleHAiOjE3MjQ0ODY3Mzd9.ynCTq1ImUmD4h6ZpZ7EaMy43nvDga8vqUURlPdAZDDI`;
export const useAccountIDStore = defineStore({
  id: 'accountid',
  state: () => ({
    accountId: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAccountId({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/accountIds`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.accountId = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteAccountId(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/accountIds/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.accountId = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createAccountId({team, account_id, email}) {
      this.loading = true
      const params = { team, account_id, email }
      try {
        const response = await axios.post(`${baseUrl}/accountIds`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.accountId = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateAccountId({id, team, account_id, email }) {
      this.loading = true
      const params = { id, team, account_id, email }
      try {
        const response = await axios.put(`${baseUrl}/accountIds/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
        })
        this.accountId = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
