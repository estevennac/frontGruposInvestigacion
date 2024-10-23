/*import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AcademicDomain } from 'src/app/types/academicDomain.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })

  export class AcademicDomainService {
    private readonly URL = environment.appApiUrl + '/academic-domains';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AcademicDomain[]> {
    return this.http.get<AcademicDomain[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<AcademicDomain> {
    return this.http.get<AcademicDomain>(`${this.URL}/${id}`);
  }

  createAcademicDomain(formData: AcademicDomain): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}*/