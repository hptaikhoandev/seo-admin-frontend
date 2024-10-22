import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useScheduleStore = defineStore({
  id: 'schedule',
  state: () => ({
    schedule: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSchedule({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/schedules`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.schedule = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteSchedule(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/schedules/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.schedule = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createSchedule({year, month, day, hour, minute, second, description, userId, campaign, status, isActive}) {
      this.loading = true
      const params = { year, month, day, hour, minute, second, description, userId, campaign, status, isActive }
      try {
        const response = await axios.post(`${baseUrl}/schedules`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.schedule = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateSchedule({id, year, month, day, hour, minute, second, description, userId, campaign, status, isActive }) {
      this.loading = true
      const params = { id, year, month, day, hour, minute, second, description, userId, campaign, status, isActive }
      try {
        const response = await axios.put(`${baseUrl}/schedules/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.schedule = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
