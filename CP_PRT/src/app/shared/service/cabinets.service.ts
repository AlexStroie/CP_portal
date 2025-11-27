import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CabinetsService {

  private apiUrl = 'http://localhost:8080/api/super-admin/cabinets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(cabinet: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cabinet);
  }

  update(id: number, cabinet: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cabinet);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/count`);
  }
}
