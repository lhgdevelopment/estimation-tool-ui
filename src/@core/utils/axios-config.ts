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

// Axios response interceptor to handle unauthenticated requests
apiRequest.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Handle logout logic
      handleLogout()
    }

    return Promise.reject(error)
  }
)

// Function to handle logout
const handleLogout = () => {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'
  }
}

export default apiRequest
