import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Area } from 'src/app/types/area.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private readonly URL = environment.appApiUrl + '/areas';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.URL}/${id}`);
  }

  createAreaForm(formData: Area): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: Area): Observable<Area> {
    return this.http.put<Area>(`${this.URL}/update/${id}`, formData);
  }}
