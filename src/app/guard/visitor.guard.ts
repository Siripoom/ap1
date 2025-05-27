import { CanActivateFn } from '@angular/router';

export const visitorGuard: CanActivateFn = (route, state) => {
  const token = JSON.parse(sessionStorage.getItem('user')+'')
  if (token) {
    document.location.replace('/home')
    return false
  } else {
    return true
  }
};
