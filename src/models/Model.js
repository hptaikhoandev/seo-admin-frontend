import { Model as BaseModel } from 'vue-api-query'
import env from '@/services/env'

export default class Model extends BaseModel {
  baseURL() {
    return env.apiUrl
  }

  // implement a default request method
  request(config) {
    return this.$http.request(config)
  }
}
