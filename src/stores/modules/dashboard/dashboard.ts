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
        const response = await axios.get(`${baseUrl}/servers`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
         const ketqua = response.data.data;
         const itemsVPSSeo1 = ketqua.filter(item => item.team === 'seo-1');
         const itemsVPSSeo2 = ketqua.filter(item => item.team === 'seo-2');
         const itemsVPSSeo3 = ketqua.filter(item => item.team === 'seo-3');
         const itemsVPSSeo4 = ketqua.filter(item => item.team === 'seo-4');

        let totalSiteAll = 0;
        let totalSiteSEO1 = 0;
        let totalSiteSEO2 = 0;
        let totalSiteSEO3 = 0;
        let totalSiteSEO4 = 0;
         for (let i = 0; i < itemsVPSSeo1.length; i++) {
          let amountDomain = await this.fetchDomainAmount({team: itemsVPSSeo1[i].team, server_ip: itemsVPSSeo1[i].server_ip});
          if (amountDomain.status === 'success') {
            totalSiteSEO1 += amountDomain.result.success;
          }
         }
         for (let i = 0; i < itemsVPSSeo2.length; i++) {
          let amountDomain = await this.fetchDomainAmount({team: itemsVPSSeo2[i].team, server_ip: itemsVPSSeo2[i].server_ip});
          if (amountDomain.status === 'success') {
            totalSiteSEO2 += amountDomain.result.success;
          }
         }
         for (let i = 0; i < itemsVPSSeo3.length; i++) {
          let amountDomain = await this.fetchDomainAmount({team: itemsVPSSeo3[i].team, server_ip: itemsVPSSeo3[i].server_ip});
          if (amountDomain.status === 'success') {
            console.log('===>amountDomain', amountDomain)
            totalSiteSEO3 += amountDomain.result.success;
          }
         }
         for (let i = 0; i < itemsVPSSeo4.length; i++) {
          let amountDomain = await this.fetchDomainAmount({team: itemsVPSSeo4[i].team, server_ip: itemsVPSSeo4[i].server_ip});
          if (amountDomain.status === 'success') {
            totalSiteSEO4 += amountDomain.result.success;
          }
         }
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
