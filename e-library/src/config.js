// E-Library App Configuration
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Default API endpoint (Production Railway Server)
  return "https://e-library-management-system-production.up.railway.app";
};

export const API_BASE_URL = getApiBaseUrl();