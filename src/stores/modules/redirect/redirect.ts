import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useRedirectStore = defineStore({
  id: 'redirect',
  state: () => ({
    redirectType: 'Wildcard Redirect',
    isValidDomainRedirectFrom: false,
    isValidDomainRedirectTo: false,
    isValidServerIP: false,
    domainRedirectFrom: [] as Array<Record<string, any>>,
    domainRedirectTo: [] as Array<Record<string, any>>,
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async redirectListDomainsToCloudflare(requestData: any) {
      this.loading = true
      let params = { 
        team: requestData.team,
        redirect_type: requestData.redirect_type,
        source_domains: requestData.source_domains,
        target_domains: requestData.target_domains
       }

      try {
        const response = await axios.post(`${baseUrlScript}/redirect-domains`, params,{ 
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
