import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('jwtToken');
  const router = inject(Router);

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
