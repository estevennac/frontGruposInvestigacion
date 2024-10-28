import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvGroupForm } from 'src/app/types/invGroup.types';

@Injectable({
  providedIn: 'root'
})
export class InvGroupService {

  private readonly URL = environment.appApiUrl + '/inv-group';

  constructor(private http: HttpClient) {}


  getAll(): Observable<InvGroupForm[]> {
    return this.http.get<InvGroupForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InvGroupForm> {
    return this.http.get<InvGroupForm>(`${this.URL}/${id}`);
  }

  createInvGroupForm(formData: InvGroupForm): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  
  getByUser(id:number):Observable<InvGroupForm> {
    return this.http.get<InvGroupForm>(`${this.URL}/user/${id}`);
  }
  update(id:number,formData: InvGroupForm): Observable<InvGroupForm> {
    return this.http.put<InvGroupForm>(`${this.URL}/update/${id}`, formData);
  }
}
