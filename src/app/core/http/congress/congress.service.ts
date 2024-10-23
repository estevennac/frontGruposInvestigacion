import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Congress } from 'src/app/types/congress.type';

@Injectable({
  providedIn: 'root'
})
export class CongressService {

  private readonly URL = environment.appApiUrl + '/congresses';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Congress[]> {
    return this.http.get<Congress[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Congress> {
    return this.http.get<Congress>(`${this.URL}/${id}`);
  }

  createCongressForm(formData: Congress): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: Congress): Observable<Congress> {
    return this.http.put<Congress>(`${this.URL}/update/${id}`, formData);
  }
}

