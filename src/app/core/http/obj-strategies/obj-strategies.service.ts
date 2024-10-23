import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjStrategies } from 'src/app/types/objStrategies.types';

@Injectable({
  providedIn: 'root'
})
export class ObjStrategiesService {

  private readonly URL = environment.appApiUrl + '/obj-strategies';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ObjStrategies[]> {
    return this.http.get<ObjStrategies[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<ObjStrategies> {
    return this.http.get<ObjStrategies>(`${this.URL}/${id}`);
  }

  createObjStrategiesForm(formData: ObjStrategies): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
