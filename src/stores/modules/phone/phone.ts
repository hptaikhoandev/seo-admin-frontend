import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const usePhoneStore = defineStore({
  id: 'phone',
  state: () => ({
    phone: [],
    total: 0,
    loading: false,
    error: null,
    selectedPhones: [],
  }),
  actions: {
    async fetchPhone({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/phones`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.phone = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async sendSMS(phoneList: any, messageList: any) {
      this.loading = true
      let params = { phoneList, messageList }
      try {
        const response = await axios.post(`${baseUrl}/phones/send-sms`, params,{ 
          headers: {
            Authorization: bearerToken
          }
         });
        // this.phone = response.data.data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deletePhone(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/phones/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.phone = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createPhone({number, vendor, userId}) {
      this.loading = true
      const params = { number, vendor, userId }
      try {
        const response = await axios.post(`${baseUrl}/phones`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.phone = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updatePhone({id, number, vendor, userId }) {
      this.loading = true
      const params = { id, number, vendor, userId }
      try {
        const response = await axios.put(`${baseUrl}/phones/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.phone = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
