const BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.29:3000'

export const buildApiUrl = (path) => `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`

export const API_BASE_URL = BASE_URL
export default BASE_URL
