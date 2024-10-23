import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NationalPlan } from 'src/app/types/nationalPlan.types';

@Injectable({
  providedIn: 'root'
})
export class NationalPlanService {

  private readonly URL = environment.appApiUrl + '/national-plans';

  constructor(private http: HttpClient) {}


  getAll(): Observable<NationalPlan[]> {
    return this.http.get<NationalPlan[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<NationalPlan> {
    return this.http.get<NationalPlan>(`${this.URL}/${id}`);
  }

  createNationalPlanForm(formData: NationalPlan): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: NationalPlan): Observable<NationalPlan> {
    return this.http.put<NationalPlan>(`${this.URL}/update/${id}`, formData);
  }
}
