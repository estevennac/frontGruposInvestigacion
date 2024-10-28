import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InvGroup_academicDomain,AcadCreaCompleto } from 'src/app/types/invGroup_academicDomain';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  getByReq(id: number): Observable<AcadCreaCompleto> {
    return this.http.get<AcadCreaCompleto>(`${this.URL}/byreq/${id}`);
  }
}






