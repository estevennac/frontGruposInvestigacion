import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ODS } from 'src/app/types/ods.types';
@Injectable({
  providedIn: 'root'
})
export class OdsService {

  private readonly URL = environment.appApiUrl + '/ods';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ODS[]> {
    return this.http.get<ODS[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<ODS> {
    return this.http.get<ODS>(`${this.URL}/${id}`);
  }

  create(formData: ODS): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: ODS): Observable<ODS> {
    return this.http.put<ODS>(`${this.URL}/update/${id}`, formData);
  }
}
