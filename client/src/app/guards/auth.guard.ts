import { CanActivateFn } from "@angular/router";

export const canActivate: CanActivateFn = () => {
  return localStorage.getItem('accessToken') ? true : false
}
