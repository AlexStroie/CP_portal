import {Injectable} from '@angular/core';
import {UserResponse} from '../model/user.model';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  // 🔹 Ștergem TOT din storage
  signOut(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  // 🔹 Salvează tokenul JWT
  saveToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  // 🔹 Returnează tokenul (sau null)
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  // 🔹 Salvează userul (stringificat)
  saveUser(user: any): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // 🔹 Returnează userul (deserializat)
  getUser(): any | null {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // 🔹 Returnează cabinetID (deserializat)
  getCabinetId(): string | null {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;

    const user = JSON.parse(userStr) as UserResponse;
    return user.cabinetId ?? null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isSuperAdmin(): boolean {
    return this.getRole() === 'SUPER_ADMIN';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }
}
