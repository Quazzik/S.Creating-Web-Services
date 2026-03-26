import { showLoginNotification, showLogoutNotification } from './notificationService';
import { history } from 'umi';

interface LoginRequest {
  Login: string;
  Password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
  };
}

const API_BASE_URL = 'http://localhost:5212/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  async login(login: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Login: login,
        Password: password,
      } as LoginRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Ошибка авторизации');
    }

    const data: LoginResponse = await response.json();

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    showLoginNotification(data.user.login);

    return data;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    history.push('/');
    showLogoutNotification();
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): { id: number; login: string } | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  },
};