import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreationReqForm } from 'src/app/types/creationReq.types';

@Injectable({
  providedIn: 'root'
})
export class CreationReqService {

  private readonly URL = environment.appApiUrl + '/creation-req';

  constructor(private http: HttpClient) {}


  getAll(): Observable<CreationReqForm[]> {
    return this.http.get<CreationReqForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<CreationReqForm> {
    return this.http.get<CreationReqForm>(`${this.URL}/${id}`);
  }
  getByGroup(id: number): Observable<CreationReqForm> {
    return this.http.get<CreationReqForm>(`${this.URL}/byGroup/${id}`);
  }

  createCreationRequestForm(formData: CreationReqForm): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: CreationReqForm): Observable<CreationReqForm> {
    return this.http.put<CreationReqForm>(`${this.URL}/update/${id}`, formData);
  }
}
