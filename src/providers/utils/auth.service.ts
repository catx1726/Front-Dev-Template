import { Injectable } from '@angular/core';
import { UID_KEY, U_TOKEN_KAY } from '../global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  CONSOLE_TAG = 'Service AuthService';

  getToken() {
    return localStorage.getItem(U_TOKEN_KAY);
  }
  getUId() {
    return localStorage.getItem(UID_KEY);
  }
  setToken(token: string) {
    return localStorage.setItem(U_TOKEN_KAY, token);
  }
  setUId(id: string) {
    return localStorage.setItem(UID_KEY, id);
  }
  delToken() {
    return localStorage.removeItem(U_TOKEN_KAY);
  }
  delUId() {
    return localStorage.removeItem(UID_KEY);
  }
  logged() {
    if (this.getToken() && this.getUId()) return true;
    return false;
  }
  quit() {
    try {
      this.delToken();
      this.delUId();
    } catch (error) {
      console.log(this.CONSOLE_TAG, 'quit() Error:', error);
    }
  }
}
