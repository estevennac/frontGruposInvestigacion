import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivityReport } from 'src/app/types/activityReport.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {

  private readonly URL = environment.appApiUrl + '/actReport';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ActivityReport[]> {
    return this.http.get<ActivityReport[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<ActivityReport> {
    return this.http.get<ActivityReport>(`${this.URL}/${id}`);
  }

  getByState(state: string): Observable<ActivityReport[]> {
    return this.http.get<ActivityReport[]>(`${this.URL}/state/${state}`);
  }
  
  createActivityReportForm(formData: ActivityReport): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: ActivityReport): Observable<ActivityReport> {
    return this.http.put<ActivityReport>(`${this.URL}/update/${id}`, formData);
  }

}
