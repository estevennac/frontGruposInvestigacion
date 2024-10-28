import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolCreaGiService {

  private readonly URL = environment.appApiUrl + '/inv-group';

  constructor(private http: HttpClient) { }
  getAll(): Observable<InvGroupForm[]> {
    return this.http.get<InvGroupForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InvGroupForm> {
    return this.http.get<InvGroupForm>(`${this.URL}/${id}`);
  }

  createInvGroup(formData: InvGroupForm): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}




