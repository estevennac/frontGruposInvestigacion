import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupRegForm } from 'src/app/types/groupRegForms';

@Injectable({
  providedIn: 'root'
})
export class GroupRegFormService {

  private readonly URL = environment.appApiUrl + '/group-reg-form';
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<GroupRegForm[]> {
    return this.http.get<GroupRegForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<GroupRegForm> {
    return this.http.get<GroupRegForm>(`${this.URL}/${id}`);
  }

  createGroupRegForm(formData: GroupRegForm): Observable<any> {
    return this.http.post(`${this.URL}/add`, formData);
  }

  update(id: number, formData: GroupRegForm): Observable<GroupRegForm>{
    return this.http.put<GroupRegForm>(`${this.URL}/update/${id}`, formData);
  }
}


