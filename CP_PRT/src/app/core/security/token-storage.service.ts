import {Injectable} from '@angular/core';

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
