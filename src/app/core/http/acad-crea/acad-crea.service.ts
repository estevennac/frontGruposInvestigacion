import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AcadCrea,AcadCreaCompleto } from 'src/app/types/acadCrea.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcadCreaService {

  private readonly URL = environment.appApiUrl + '/acad-creas';

  constructor(private http: HttpClient) { }

  getAll(): Observable<AcadCrea[]> {
    return this.http.get<AcadCrea[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<AcadCrea> {
    return this.http.get<AcadCrea>(`${this.URL}/${id}`);
  }

  createAcadCreaForm(formData: AcadCrea): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByReq(id: number): Observable<AcadCreaCompleto> {
    return this.http.get<AcadCreaCompleto>(`${this.URL}/byreq/${id}`);
  }
}






