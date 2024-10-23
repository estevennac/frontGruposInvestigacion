import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpperLevelPlan } from 'src/app/types/upperLevelPlan.types';

@Injectable({
  providedIn: 'root'
})
export class UpperLevelPlanService {

  private readonly URL = environment.appApiUrl + '/upper-level-plans';

  constructor(private http: HttpClient) {}


  getAll(): Observable<UpperLevelPlan[]> {
    return this.http.get<UpperLevelPlan[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<UpperLevelPlan> {
    return this.http.get<UpperLevelPlan>(`${this.URL}/${id}`);
  }

  createUpperLevelPlanForm(formData: UpperLevelPlan): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: UpperLevelPlan): Observable<UpperLevelPlan> {
    return this.http.put<UpperLevelPlan>(`${this.URL}/update/${id}`, formData);
  }
}
