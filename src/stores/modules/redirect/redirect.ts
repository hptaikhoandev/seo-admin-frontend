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
    domainRedirectDelete: [] as Array<Record<string, any>>,
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
        target_domains: requestData.target_domains,
        delete_domains: requestData.delete_domains,
       }

      try {
        const isDeleteRedirect = requestData.redirect_type === 'Delete Redirect';
        const url = `${baseUrlScript}/redirect-domains`;

        const options = { 
            headers: {
                Authorization: bearerToken,
                'Content-Type': 'application/json'
            },
            timeout: 7200000
        };

        const response = isDeleteRedirect
        ? await axios.delete(url, {headers: options.headers, data: params})
        : await axios.post(url, params, options);

        return response?.data;
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async getListRulesFromDomain(requestData: any) {
      this.loading = true;
      let params = { 
        team: requestData.team,
        domains: requestData.domains.trim().replace(/\s+/g, '')
      }

      try {
        const url = `${baseUrlScript}/get-rules-from-domains`;

        const options = { 
            headers: {
                Authorization: bearerToken,
                'Content-Type': 'application/json'
            },
            timeout: 7200000
        };

        const response = await axios.get(url, { headers: options.headers, params: params });
       

        return response?.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteRuleItem(requestData: any) {
      this.loading = true;
      let params = { 
        team: requestData.team,
        rule_id: requestData.rule_id,
        zone_id: requestData.zone_id
      }
      console.log("--params: ", params)

      try {
        const url = `${baseUrlScript}/delete-redirect-history`;

        const options = { 
            headers: {
                Authorization: bearerToken,
                'Content-Type': 'application/json'
            },
            timeout: 7200000
        };

        const response = await axios.delete(url, { headers: options.headers, data: params });
       
        return response?.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  }
});
