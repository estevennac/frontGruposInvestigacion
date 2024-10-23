import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreaAreaForm,CreaAreaCompleto } from 'src/app/types/creaArea.types';

@Injectable({
  providedIn: 'root'
})
export class CreaAreaService {

  private readonly URL = environment.appApiUrl + '/crea-areas';

  constructor(private http: HttpClient) {}


  getAll(): Observable<CreaAreaForm[]> {
    return this.http.get<CreaAreaForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<CreaAreaForm> {
    return this.http.get<CreaAreaForm>(`${this.URL}/${id}`);
  }
  createAreaCreaForm(formData: CreaAreaForm): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByReq(id: number): Observable<CreaAreaCompleto> {
    return this.http.get<CreaAreaCompleto>(`${this.URL}/byreq/${id}`);
  }
}
