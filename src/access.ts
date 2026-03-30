import { authService } from './services/auth';

export default function access() {
  const isAuthenticated = authService.isAuthenticated();

  return {
    canAccess: isAuthenticated,
  };
}
