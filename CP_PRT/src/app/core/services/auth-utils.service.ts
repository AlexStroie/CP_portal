import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthUtilsService {

  static checkStrength(password: string): string {

    let passwordStrength;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) passwordStrength = 'weak';
    else if (score <= 3) passwordStrength = 'medium';
    else passwordStrength = 'strong';

    return passwordStrength;
  }
}
