import {Injectable} from '@angular/core';

enum StorageKeys {
  TOKEN = 'auth-token',
  USER = 'auth-user',
  MODULES = 'modules'
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() {
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(StorageKeys.TOKEN);
    window.sessionStorage.setItem(StorageKeys.TOKEN, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(StorageKeys.TOKEN);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(StorageKeys.USER);
    window.sessionStorage.setItem(StorageKeys.USER, JSON.stringify(user));
  }

  public getUser(): any | null {
    const user = window.sessionStorage.getItem(StorageKeys.USER);
    return user ? JSON.parse(user) : null;
  }

  public saveModules(modules: string): void {
    window.sessionStorage.removeItem(StorageKeys.MODULES);
    window.sessionStorage.setItem(StorageKeys.MODULES, modules);
  }

  public getModules(): string | null {
    return window.sessionStorage.getItem(StorageKeys.MODULES);
  }
}
