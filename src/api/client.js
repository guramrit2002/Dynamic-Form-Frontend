import axios from 'axios'

const client = axios.create({ baseURL: 'https://supplemental-introductory-structures-cherry.trycloudflare.com/forms/api' })

client.interceptors.request.use((config) => {
  const credentials = localStorage.getItem('credentials')
  if (credentials) {
    config.headers['Authorization'] = `Basic ${credentials}`
  }
  return config
})

export function setCredentials(username, password) {
  localStorage.setItem('credentials', btoa(`${username}:${password}`))
}

export function clearCredentials() {
  localStorage.removeItem('credentials')
}

export function hasCredentials() {
  return !!localStorage.getItem('credentials')
}

// No auth header — used for public share endpoints
  export const publicClient = axios.create({ baseURL: 'https://supplemental-introductory-structures-cherry.trycloudflare.com/forms/api' })

export default client
