import { config } from '@/lib/config';
import { ApiError } from './errors';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = config.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    if (import.meta.env.DEV) {
      console.log(`[API] ${options?.method || 'GET'} ${endpoint}`);
    }

    const headers: HeadersInit = { ...options?.headers };
    const method = options?.method || 'GET';
    const hasBody = options?.body && method !== 'GET' && method !== 'HEAD';
    
    // 🔧 CRITICAL FIX: Don't force JSON if the body is FormData
    const isFormData = options?.body instanceof FormData;

    // Only set Content-Type for JSON requests (not FormData)
    if (hasBody && !isFormData && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, response.statusText, errorData);
      }

      // Handle 204 No Content or 202 Accepted
      if (response.status === 204 || response.status === 202) {
        return undefined as T;
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // Fallback for plain text responses
      return (await response.text()) as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(this.cleanParams(params)).toString()}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary
    });
  }

  private cleanParams(params: Record<string, any>): Record<string, string> {
    const cleaned: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Handle array parameters
          value.forEach((item) => {
            cleaned[key] = String(item);
          });
        } else {
          cleaned[key] = String(value);
        }
      }
    });
    return cleaned;
  }
}

export const apiClient = new ApiClient();
