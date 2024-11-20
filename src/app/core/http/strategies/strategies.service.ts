import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Strategies } from 'src/app/types/strategies.types';
import { ObjStrategiesComplete } from 'src/app/types/strategies.types';
@Injectable({
  providedIn: 'root'
})
export class StrategiesService {

  private readonly URL = environment.appApiUrl + '/strategies';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Strategies[]> {
    return this.http.get<Strategies[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Strategies> {
    return this.http.get<Strategies>(`${this.URL}/${id}`);
  }

  getByPlan(id: number): Observable<ObjStrategiesComplete[]> {
    return this.http.get<ObjStrategiesComplete[]>(`${this.URL}/complete/${id}`);
  }
  getByObj(id: number): Observable<Strategies[]> {
    return this.http.get<Strategies[]>(`${this.URL}/byObj/${id}`);
  }
  createStrategiesForm(formData: Strategies): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  update(id: number, formData: Strategies): Observable<Strategies>{
    return this.http.put<Strategies>(`${this.URL}/update/${id}`, formData)
  }
}
