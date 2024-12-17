import { defineStore } from 'pinia';
import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const baseUrlScript = `${import.meta.env.VITE_API_URL_SCRIPT}`;
const bearerToken = 'Bearer ' + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiaWF0IjoxNzI0NDQzNTM3LCJleHAiOjE3MjQ0ODY3Mzd9.ynCTq1ImUmD4h6ZpZ7EaMy43nvDga8vqUURlPdAZDDI`;
export const useServerStore = defineStore({
  id: 'server',
  state: () => ({
    server: [],
    total: 0,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchServer({page, limit, search, sortBy, sortDesc}) {
      this.loading = true
      let params = { page, limit, search, sortBy, sortDesc }
      try {
        const response = await axios.get(`${baseUrl}/servers`, { 
          params,
          headers: {
            Authorization: bearerToken
          }
         })
        const servers = response.data.data;
        for (const server of servers) {
          try {
            const res = await this.getStatusServer({ team: server.team, server_ip: server.server_ip });
            if (res.data?.instance_state === 'running') {
              server.iconStartDisable = true; // Không thể start
              server.iconStopDisable = false;  // Có thể stop
              server.iconRestartDisable = false; // Không thể restart
            } else {
              server.iconStartDisable = false; // Có thể start
              server.iconStopDisable = true;  // Không thể stop
              server.iconRestartDisable = true; // Không thể restart
            }  
          } catch (error: any) {
            server.iconStartDisable = false; // Có thể start
            server.iconStopDisable = true;  // Không thể stop
            server.iconRestartDisable = true; // Không thể restart
          }
        }
        this.server = await servers;
        this.total = response.data.total;
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async deleteServer(id: number) {
      this.loading = true
      try {
        const response = await axios.delete(`${baseUrl}/servers/` + id, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.server = response.data.data
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createServer({server_ip, team}) {
      this.loading = true
      const params = { server_ip, team }
      try {
        const response = await axios.post(`${baseUrl}/servers`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.server = response.data.data
        this.total = response.data.total
        return response.data;
      } catch (error: any) {
        // this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createServerImport({server_ip, team, private_key}) {
      this.loading = true
      const params = { server_ip, team, private_key }
      try {
        const response = await axios.post(`${baseUrl}/servers/import-servers`, params, { 
          headers: {
            Authorization: bearerToken
          }
         })
        this.server = response.data.data
        this.total = response.data.total
        return response.data;
      } catch (error: any) {
        // this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateServer({id, server_ip, team }) {
      this.loading = true
      const params = { id, server_ip, team }
      try {
        const response = await axios.put(`${baseUrl}/servers/` + params.id, params, { 
          headers: {
            Authorization: bearerToken
          }
        })
        this.server = response.data.data
        this.total = response.data.total
        return response.data;
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async getStatusServer({team, server_ip}) {
      this.loading = true
      const params = { team, server_ip }
      try {
        const response = await axios.post(`${baseUrlScript}/status-servers`, params, { 
          headers: {
            Authorization: bearerToken,
            KeepAlive: 'timeout=7200',
          },
         });
        
        return response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async transitionsServer({team, server_ip, transitions}) {
      this.loading = true
      const params = { team, server_ip, transitions }
      try {
        const response = await axios.post(`${baseUrlScript}/transitions-server`, params, { 
          headers: {
            Authorization: bearerToken,
            KeepAlive: 'timeout=7200',
          },
         });
        
        return response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  }
});
