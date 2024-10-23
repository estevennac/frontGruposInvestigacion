import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LineCrea,LineCreaCompleto } from 'src/app/types/lineCrea.types';

@Injectable({
  providedIn: 'root'
})
export class LineCreaService {

  private readonly URL = environment.appApiUrl + '/line-creas';

  constructor(private http: HttpClient) {}


  getAll(): Observable<LineCrea[]> {
    return this.http.get<LineCrea[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<LineCrea> {
    return this.http.get<LineCrea>(`${this.URL}/${id}`);
  }

  createLineCreaForm(formData: LineCrea): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByReq(id: number): Observable<LineCreaCompleto> {
    return this.http.get<LineCreaCompleto>(`${this.URL}/byreq/${id}`);
  }
}
