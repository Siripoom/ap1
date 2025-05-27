import { CanActivateFn } from '@angular/router';

export const evaluatorGuard: CanActivateFn = (route, state) => {
  const token = JSON.parse(sessionStorage.getItem('user')+'')
  const role = [
    'developer',
    // 'sender',
    'evaluator',
    'admin',
  ]
  let checker = 0
  for (let index = 0; index <role.length; index++) {
    if (token.role == role[index]) {
      checker = 1
    }
  }
  if (checker == 1) {
    return true
  } else {
    document.location.replace('/signin')
    return false
  }
};
