export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  cdnUrl: import.meta.env.VITE_CDN_URL || 'http://localhost:8080',
  mapTilerApiKey: import.meta.env.VITE_MAPTILER_API_KEY || '',
} as const;

// Validate required env vars in development
if (import.meta.env.DEV) {
  if (!config.mapTilerApiKey) {
    console.warn('⚠️ VITE_MAPTILER_API_KEY is not set');
  }
}
