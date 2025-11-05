/**
 * API Configuration
 * Uses environment variables from .env files
 * Falls back to localhost for development
 */

const API_CONFIG = {
  // Analytics API Base URL
  ANALYTICS_API: process.env.REACT_APP_ANALYTICS_API || 'http://localhost:7006',

  // Acumatica API Base URL (not currently used in client)
  ACUMATICA_API: process.env.REACT_APP_ACUMATICA_API || 'http://localhost:4001',
};

export default API_CONFIG;
