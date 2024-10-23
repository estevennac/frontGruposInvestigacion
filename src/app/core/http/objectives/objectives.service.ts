import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Objectives } from 'src/app/types/objectives.types';

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService {

  private readonly URL = environment.appApiUrl + '/objectives';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Objectives[]> {
    return this.http.get<Objectives[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Objectives> {
    return this.http.get<Objectives>(`${this.URL}/${id}`);
  }

  createObjectivesForm(formData: Objectives): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

}
