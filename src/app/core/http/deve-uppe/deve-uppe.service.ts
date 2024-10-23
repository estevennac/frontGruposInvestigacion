import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeveUppe,UpperLevelPlanFilter } from 'src/app/types/deveUppe.types';

@Injectable({
  providedIn: 'root'
})
export class DeveUppeService {

  private readonly URL = environment.appApiUrl + '/deve-uppes';

  constructor(private http: HttpClient) {}


  getAll(): Observable<DeveUppe[]> {
    return this.http.get<DeveUppe[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<DeveUppe> {
    return this.http.get<DeveUppe>(`${this.URL}/${id}`);
  }

  createDeveUppeForm(formData: DeveUppe): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByDev(id:number):Observable<UpperLevelPlanFilter>{
    return this.http.get<UpperLevelPlanFilter>(`${this.URL}/bydev/${id}`);
  }
}
