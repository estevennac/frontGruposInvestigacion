import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LegalFramework } from 'src/app/types/legalFramework.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LegalFrameworkService {

  private readonly URL = environment.appApiUrl + '/legal-frameworks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<LegalFramework[]> {
    return this.http.get<LegalFramework[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<LegalFramework> {
    return this.http.get<LegalFramework>(`${this.URL}/${id}`);
  }

  createLegalFramework(formData: LegalFramework): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  update(id: number, formData: LegalFramework): Observable<LegalFramework> {
    return this.http.put<LegalFramework>(`${this.URL}/update/${id}`, formData);
  }
  
}

