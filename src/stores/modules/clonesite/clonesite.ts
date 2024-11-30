import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useClonesiteStore = defineStore({
  id: 'clonesite',
  state: () => ({
    serverIP: '',
    domainNameSource: '',
    domainNameTarget: '',
    isDomainNameSourceValid: false,
    isDomainNameTargetValid: false,
    isServerIPValid: false,
    loading: false,
    error: null,
  }),
  actions: {
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
    async cloneSite(requestData: any) {
      this.loading = true
      let params = { 
        team: requestData.team,
        server_ip: requestData.server_ip,
        source_domain: requestData.source_domain,
        target_domain: requestData.target_domain
       }

      try {
        console.log('params', params)
        const response = await axios.post(`${baseUrlScript}/clone-site`, params,{ 
          headers: {
            Authorization: bearerToken,
            KeepAlive: 'timeout=7200',
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
