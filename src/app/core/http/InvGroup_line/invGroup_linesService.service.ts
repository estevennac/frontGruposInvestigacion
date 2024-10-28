import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvGroup_line,LineCreaCompleto } from 'src/app/types/invGroup_line';

@Injectable({
  providedIn: 'root'
})
export class InvGroup_linesService {

  private readonly URL = environment.appApiUrl + '/invGroup_lines';

  constructor(private http: HttpClient) {}


  getAll(): Observable<InvGroup_line[]> {
    return this.http.get<InvGroup_line[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InvGroup_line> {
    return this.http.get<InvGroup_line>(`${this.URL}/${id}`);
  }

  createInvGroup_lineForm(formData: InvGroup_line): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByReq(id: number): Observable<LineCreaCompleto> {
    return this.http.get<LineCreaCompleto>(`${this.URL}/byreq/${id}`);
  }
}
