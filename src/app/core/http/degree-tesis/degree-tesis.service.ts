import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DegreeTesisForm } from 'src/app/types/degreeTesis.types';

@Injectable({
  providedIn: 'root'
})
export class DegreeTesisService {

  private readonly URL = environment.appApiUrl + '/degree-teses';

  constructor(private http: HttpClient) {}


  getAll(): Observable<DegreeTesisForm[]> {
    return this.http.get<DegreeTesisForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<DegreeTesisForm> {
    return this.http.get<DegreeTesisForm>(`${this.URL}/${id}`);
  }

  createDegreeTesisForm(formData: DegreeTesisForm): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

}
