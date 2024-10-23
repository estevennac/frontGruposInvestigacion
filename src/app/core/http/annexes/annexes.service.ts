import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annexes } from 'src/app/types/annexes.types';

@Injectable({
  providedIn: 'root'
})
export class AnnexesService {

  private readonly URL = environment.appApiUrl + '/annexes';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Annexes[]> {
    return this.http.get<Annexes[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Annexes> {
    return this.http.get<Annexes>(`${this.URL}/${id}`);
  }
  getByGroupType(id: number,tipo:string): Observable<Annexes[]> {
    return this.http.get<Annexes[]>(`${this.URL}/group/${id}/type/${tipo}`);
  }

  createAnnexesForm(formData: Annexes): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: Annexes): Observable<Annexes> {
    return this.http.put<Annexes>(`${this.URL}/update/${id}`, formData);
  }
}
