import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Auth
export const signup = (data) => API.post('/signup', data)
export const login = (data) => API.post('/login', data)
export const logout = () => API.get('/logout')
export const getUser = () => API.get('/user')

// Upload
export const uploadScan = (formData) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Doctors
export const fetchDoctors = (location) =>
  API.post('/select-doctor', { location })

export default API
