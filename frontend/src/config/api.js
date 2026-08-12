const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return 'https://carbonwisecalc.com';
};

const BASE_URL = getBaseUrl();

export const buildApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  
  // Jika halaman dimuat melalui HTTPS, paksa penggunaan HTTPS origin agar bebas Mixed Content Error
  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:') {
    const origin = window.location.origin;
    if (!BASE_URL.startsWith('https:')) {
      return `${origin}${cleanPath}`;
    }
  }
  
  return `${BASE_URL}${cleanPath}`;
};

export const API_BASE_URL = BASE_URL;
export default BASE_URL;
