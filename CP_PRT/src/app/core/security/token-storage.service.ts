import { Injectable } from '@angular/core';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  // 🔹 Ștergem TOT din storage
  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // 🔹 Salvează tokenul JWT
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // 🔹 Returnează tokenul (sau null)
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // 🔹 Salvează userul (stringificat)
  saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // 🔹 Returnează userul (deserializat)
  getUser(): any | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
