import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const user = localStorage.getItem('user');
const userObj = user ? JSON.parse(user) : null;
const bearerToken = 'Bearer ' + userObj.user.token;

export const useTerminalStore = defineStore({
  id: 'terminal',
  state: () => ({
    serverList: [] as Array<Record<string, any>>,
    choicedServers: [] as Array<Record<string, any>>,
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async execCommands(requestData: any) {
      this.loading = true
      let params = { 
        team: userObj.user.roleId,
        server_ip: requestData.server,
        command: requestData.command,
       }

      try {
        const url = `${baseUrlScript}/exec-command`;

        const options = { 
            headers: {
                Authorization: bearerToken,
                'Content-Type': 'application/json'
            },
            timeout: 7200000
        };

        const response = await axios.post(url, params, options);

        return response?.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchServerList(team: any) {
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
  }
});
