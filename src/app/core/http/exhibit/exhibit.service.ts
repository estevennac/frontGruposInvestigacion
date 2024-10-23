import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exhibit } from 'src/app/types/exhibit.types';

@Injectable({
  providedIn: 'root'
})
export class ExhibitService {

  private readonly URL = environment.appApiUrl + '/exhibit';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Exhibit[]> {
    return this.http.get<Exhibit[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Exhibit> {
    return this.http.get<Exhibit>(`${this.URL}/${id}`);
  }

  createExhibitForm(formData: Exhibit): Observable<any> {
    return this.http.post(`${this.URL}/add`, formData);
  }
}
