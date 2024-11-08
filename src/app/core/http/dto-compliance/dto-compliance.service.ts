import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DtoCompliance } from 'src/app/types/dtoCompliance.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DtoComplianceService
{

  private readonly URL = environment.appApiUrl + '/dtoCompliances';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DtoCompliance[]>
  {
    return this.http.get<DtoCompliance[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<DtoCompliance>
  {
    return this.http.get<DtoCompliance>(`${this.URL}/${id}`);
  }

  createDtoComplianceForm(formData: DtoCompliance): Observable<any>
  {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: DtoCompliance): Observable<DtoCompliance>
  {
    return this.http.put<DtoCompliance>(`${this.URL}/update/${id}`, formData);
  }
}