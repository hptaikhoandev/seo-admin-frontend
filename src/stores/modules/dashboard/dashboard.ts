import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;
export const useDashboardStore = defineStore({
  id: 'dashboard',
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
    async fetchServerList() {
      this.loading = true
      let params = { 
        page: 1, 
        limit: 10000, 
        search: '', 
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
    async fetchDomainsAmountParam() {
      this.loading = true
      let params = { 
        page: 1, 
        limit: 10000, 
        search: '', 
        sortBy : 'team', 
        sortDesc: 'false' 
      }
      try {
        const response = await axios.get(`${baseUrl}/tasks`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
         const ketqua = response.data.data;
         const itemsSeo1 = ketqua.filter(item => item.team === 'seo-1');
         const itemsSeo2 = ketqua.filter(item => item.team === 'seo-2');
         const itemsSeo3 = ketqua.filter(item => item.team === 'seo-3');
         const itemsSeo4 = ketqua.filter(item => item.team === 'seo-4');
        let totalSiteAll = 0;
        let totalSiteSEO1 = Number(itemsSeo1[0].total_sites);
        let totalSiteSEO2 = Number(itemsSeo2[0].total_sites);
        let totalSiteSEO3 = Number(itemsSeo3[0].total_sites);
        let totalSiteSEO4 = Number(itemsSeo4[0].total_sites);
        
        totalSiteAll = totalSiteSEO1 + totalSiteSEO2 + totalSiteSEO3 + totalSiteSEO4;  

        return {
          totalSiteAll,
          totalSiteSEO1,
          totalSiteSEO2,
          totalSiteSEO3,
          totalSiteSEO4,
        }
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
