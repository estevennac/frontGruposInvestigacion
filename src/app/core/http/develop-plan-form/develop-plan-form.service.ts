import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { DevelopmentPlanForms } from 'src/app/types/developPlanForm';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DevelopmentPlanService {

  private readonly URL = environment.appApiUrl + '/development-plan';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DevelopmentPlanForms[]> {
    return this.http.get<DevelopmentPlanForms[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<DevelopmentPlanForms> {
    return this.http.get<DevelopmentPlanForms>(`${this.URL}/${id}`);
  }
  getByIdGroupC(id: number): Observable<DevelopmentPlanForms> {
    return this.http.get<DevelopmentPlanForms>(`${this.URL}/groupC/${id}`);
  }
  getByIdGroupAndType(id: number,type:string): Observable<DevelopmentPlanForms> {
    return this.http.get<DevelopmentPlanForms>(`${this.URL}/group/${id}/Type/${type}`);
  }
  create(formData: DevelopmentPlanForms): Observable<any> {
    return this.http.post<any>(`${this.URL}/create`, formData);
  }


}




