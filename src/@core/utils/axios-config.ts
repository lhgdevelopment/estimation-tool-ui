import axios from 'axios'
import Cookies from 'js-cookie'

const apiRequest = axios.create({
  baseURL: process.env.API_BASE_URL
})

// Axios request interceptor to add the token to the request headers
apiRequest.interceptors.request.use(config => {
  const token = Cookies.get('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
apiRequest.interceptors.response.use(function (response) {
  return response.data
})

export default apiRequest
