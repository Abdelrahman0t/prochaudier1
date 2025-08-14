import tokenManager from './tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const apiRequest = async (
  endpoint: string, 
  options: RequestOptions = {}
): Promise<Response> => {
  const { skipAuth = false, headers = {}, ...restOptions } = options;
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add authorization header if not skipping auth
if (!skipAuth) {
  const token = tokenManager.getValidToken();
  const isAuth = tokenManager.isAuthenticated();
  
  console.log('🔍 Debug token:', token ? 'TOKEN_EXISTS' : 'NO_TOKEN');
  console.log('🔍 Debug isAuthenticated:', isAuth);
  
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  } else if (isAuth === false) {
    throw new Error('Authentication required');
  } else {
    console.log('⚠️ No token but auth status unclear');
  }
}

  // Add default content type
  if (!headers.hasOwnProperty('Content-Type') && (restOptions.method === 'POST' || restOptions.method === 'PUT')) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers
    });

    // Handle 401 responses (token might be invalid on server)
    if (response.status === 401 && !skipAuth) {
      console.log('🔐 Received 401, clearing tokens');
      tokenManager.clearAllTokens();
      window.dispatchEvent(new CustomEvent('tokenExpired'));
      throw new Error('Authentication failed');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Convenience methods
export const apiGet = (endpoint: string, options?: RequestOptions) => 
  apiRequest(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint: string, data?: any, options?: RequestOptions) =>
  apiRequest(endpoint, { 
    ...options, 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined 
  });

export const apiPut = (endpoint: string, data?: any, options?: RequestOptions) =>
  apiRequest(endpoint, { 
    ...options, 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined 
  });

export const apiDelete = (endpoint: string, options?: RequestOptions) =>
  apiRequest(endpoint, { ...options, method: 'DELETE' });