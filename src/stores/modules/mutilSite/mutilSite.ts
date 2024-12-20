import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useMutilSiteStore = defineStore({
  id: 'mutilSite',
  state: () => ({
    serverIP: '',
    isServerIPValid: false,
    domain: [] as Array<Record<string, any>>,
    isDomainValid: false,
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async addListDomainsToMultiSites(requestData: any) {
      this.loading = true
      let params = { 
        team: requestData.team,
        server_ip: requestData.server_ip,
        domains: requestData.domains
       }
      try {
        const response = await axios.post(`${baseUrlScript}/add-list-domains-to-multi-sites`, params,{ 
          headers: {
            Authorization: bearerToken,
            },
          timeout: 7200000,
         });
        return response.data;
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async fetchServerList(team) {
      this.loading = true
      let params = { 
        page: 1, 
        limit: 10000, 
        search: team, 
        sortBy : 'team', 
        sortDesc: 'false' 
      }
      try {
        const response = await axios.get(`${baseUrl}/servers`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        return response.data.data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async fetchDomainAmount({team, server_ip}) {
      this.loading = true
      try {
        let params = { 
          team: team,
          server_ip: server_ip,
        }
        const response = await axios.get(`${baseUrlScript}/count-domains`, {
          params,
          headers: {
            Authorization: bearerToken,
          },
        });
        return response.data;
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
