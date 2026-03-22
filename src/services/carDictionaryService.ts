import { message } from 'antd';
import { authService } from './auth';

export interface DictionaryItem {
  id: number;
  name: string;
}

const API_BASE_URL = 'http://localhost:5212/api';

const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  if (!token) {
    console.warn('Token not found. User may need to re-authenticate.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'text/plain'
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 401) {
    authService.logout();
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
  }
  if (response.status === 204) return null as unknown as T;
  return await response.json();
};

const request = async <T>(endpoint: string, method: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
};

// === CarBrands ===
export const carBrandApi = {
  getAll: (): Promise<DictionaryItem[]> => 
    request<DictionaryItem[]>('/carbrands', 'GET'),
  
  getById: (id: number): Promise<DictionaryItem> => 
    request<DictionaryItem>(`/carbrands/${id}`, 'GET'),
  
  create: (name: string): Promise<DictionaryItem> => 
    request<DictionaryItem>('/carbrands', 'POST', { name }),
  
  update: (id: number, name: string): Promise<DictionaryItem> => 
    request<DictionaryItem>(`/carbrands/${id}`, 'PUT', { name }),
  
  delete: (id: number): Promise<void> => 
    request<void>(`/carbrands/${id}`, 'DELETE'),
};

// === TrimLevels ===
export const trimLevelApi = {
  getAll: (): Promise<DictionaryItem[]> => 
    request<DictionaryItem[]>('/trimlevels', 'GET'),
  
  getById: (id: number): Promise<DictionaryItem> => 
    request<DictionaryItem>(`/trimlevels/${id}`, 'GET'),
  
  create: (name: string): Promise<DictionaryItem> => 
    request<DictionaryItem>('/trimlevels', 'POST', { name }),
  
  update: (id: number, name: string): Promise<DictionaryItem> => 
    request<DictionaryItem>(`/trimlevels/${id}`, 'PUT', { name }),
  
  delete: (id: number): Promise<void> => 
    request<void>(`/trimlevels/${id}`, 'DELETE'),
};