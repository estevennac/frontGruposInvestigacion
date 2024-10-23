import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvgActi } from 'src/app/types/invgActi.types';

@Injectable({
  providedIn: 'root'
})
export class InvgActiService {

  private readonly URL = environment.appApiUrl + '/invg-actis';

  constructor(private http: HttpClient) {}


  getAll(): Observable<InvgActi[]> {
    return this.http.get<InvgActi[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InvgActi> {
    return this.http.get<InvgActi>(`${this.URL}/${id}`);
  }

  createInvgActiForm(formData: InvgActi): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
