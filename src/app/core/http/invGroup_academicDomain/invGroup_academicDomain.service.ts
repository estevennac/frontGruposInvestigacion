import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InvGroup_academicDomain,AcadCreaCompleto } from 'src/app/types/invGroup_academicDomain';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcademicDomain } from 'src/app/types/academicDomain.types';

@Injectable({
  providedIn: 'root'
})
export class InvGroup_academicDomainService {

  private readonly URL = environment.appApiUrl + '/invGroup_academicDomain';

  constructor(private http: HttpClient) { }

  getAll(): Observable<InvGroup_academicDomain[]> {
    return this.http.get<InvGroup_academicDomain[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InvGroup_academicDomain> {
    return this.http.get<InvGroup_academicDomain>(`${this.URL}/${id}`);
  }

  createAcadCreaForm(formData: InvGroup_academicDomain): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByGroup(id: number): Observable<AcademicDomain[]> {
    return this.http.get<AcademicDomain[]>(`${this.URL}/byGroup/${id}`);
  }
}






