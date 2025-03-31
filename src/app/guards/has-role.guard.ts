import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const userRole = authService.getUserRole();
  const allowedRoles = route.data?.['roles'] || [];

  if (allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
