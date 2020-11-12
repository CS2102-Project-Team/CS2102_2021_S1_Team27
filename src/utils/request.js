import axios from 'axios'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken() !== undefined) {
      console.log(`got token: ${getToken()}`)
      config.headers.Authorization = `Bearer ${getToken()}`
    } else {
      console.log('Dun hv token!')
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code>=300, it is judged as an error.
    if (res.code >= 300) {
      console.log(res.error.toString() || 'Error')
      return Promise.reject(new Error(res.error || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error.toString())
    return Promise.reject(error)
  }
)

export default service
