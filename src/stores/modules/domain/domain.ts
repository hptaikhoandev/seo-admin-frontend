import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useDomainStore = defineStore({
  id: 'domain',
  state: () => ({
    serverIP: '',
    isSSL: 'flexible',
    isServerIPValid: false,
    domain: [] as Array<Record<string, any>>,
    domainNS: [] as Array<Record<string, any>>,
    domainExport: [] as Array<Record<string, any>>,
    total: 0,
    loading: false,
    error: null,
    selectedDomains: [],
  }),
  actions: {
    async fetchDomain({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/domains`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        this.domain = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async addListDomainsToCloudflare(requestData: any) {
      this.loading = true
      let params = { 
        team: requestData.team,
        server_ip: requestData.server_ip,
        ssl_type: requestData.ssl_type,
        domains: requestData.domains

       }
      try {
        const response = await axios.post(`${baseUrlScript}/add-list-domains-to-cloudflare`, params,{ 
          headers: {
            Authorization: bearerToken,
            },
          timeout: 7200000,
         });
        
        if (response.data?.resultMessage.success.count !== 0) {
          this.domainNS.push(response.data.results[0]);
        }
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
    async deleteDomain(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/domains/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.domain = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createDomain({ name, ns, status, userId }) {
      this.loading = true
      const params = {  name, ns, status, userId  }
      try {
        const response = await axios.post(`${baseUrl}/domains`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.domain = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateDomain({id, name }) {
      this.loading = true
      const params = { id, name }
      try {
        const response = await axios.put(`${baseUrl}/domains/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.domain = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  }
});
