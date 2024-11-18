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

  private readonly URL = environment.appApiUrl + '/complience';

  constructor(private http: HttpClient) {}

  getByObj(id: number): Observable<DtoCompliance[]>
  {
    return this.http.get<DtoCompliance[]>(`${this.URL}/specificObj/${id}`);
  }

  getByAcReport(id: number): Observable<DtoCompliance[]>
  {
    return this.http.get<DtoCompliance[]>(`${this.URL}/activityReport/${id}`);
  }

  createDtoComplianceForm(formData: DtoCompliance): Observable<any>
  {
    return this.http.post(`${this.URL}/create`, formData);
  }

}