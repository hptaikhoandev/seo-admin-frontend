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
        let totalSiteSEO1 = itemsSeo1.reduce((sum, item) => sum + Number(item.sites), 0);
        let totalSiteSEO2 = itemsSeo2.reduce((sum, item) => sum + Number(item.sites), 0);
        let totalSiteSEO3 = itemsSeo3.reduce((sum, item) => sum + Number(item.sites), 0);
        let totalSiteSEO4 = itemsSeo4.reduce((sum, item) => sum + Number(item.sites), 0);
        
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
    async fetchCPUsAmountParam() {
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
         const ketqua = response.data.data;
         const itemsSeo1 = ketqua.filter(item => item.team === 'seo-1');
         const itemsSeo2 = ketqua.filter(item => item.team === 'seo-2');
         const itemsSeo3 = ketqua.filter(item => item.team === 'seo-3');
         const itemsSeo4 = ketqua.filter(item => item.team === 'seo-4');
        let totalCPUAll = 0;
        let totalCPUSEO1 = itemsSeo1.reduce((sum, item) => sum + Number(item.cpu), 0);
        let totalCPUSEO2 = itemsSeo2.reduce((sum, item) => sum + Number(item.cpu), 0);
        let totalCPUSEO3 = itemsSeo3.reduce((sum, item) => sum + Number(item.cpu), 0);
        let totalCPUSEO4 = itemsSeo4.reduce((sum, item) => sum + Number(item.cpu), 0);
        
        totalCPUAll = totalCPUSEO1 + totalCPUSEO2 + totalCPUSEO3 + totalCPUSEO4;  

        return {
          totalCPUAll,
          totalCPUSEO1,
          totalCPUSEO2,
          totalCPUSEO3,
          totalCPUSEO4,
        }
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async fetchRAMsAmountParam() {
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
         const ketqua = response.data.data;
         const itemsSeo1 = ketqua.filter(item => item.team === 'seo-1');
         const itemsSeo2 = ketqua.filter(item => item.team === 'seo-2');
         const itemsSeo3 = ketqua.filter(item => item.team === 'seo-3');
         const itemsSeo4 = ketqua.filter(item => item.team === 'seo-4');
        let totalRamAll = 0;
        let totalRamSEO1 = itemsSeo1.reduce((sum, item) => sum + Number(item.ram), 0);
        let totalRamSEO2 = itemsSeo2.reduce((sum, item) => sum + Number(item.ram), 0);
        let totalRamSEO3 = itemsSeo3.reduce((sum, item) => sum + Number(item.ram), 0);
        let totalRamSEO4 = itemsSeo4.reduce((sum, item) => sum + Number(item.ram), 0);
        
        totalRamAll = totalRamSEO1 + totalRamSEO2 + totalRamSEO3 + totalRamSEO4;  

        return {
          totalRamAll,
          totalRamSEO1,
          totalRamSEO2,
          totalRamSEO3,
          totalRamSEO4,
        }
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
  }
});
