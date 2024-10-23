import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Magazines } from 'src/app/types/magazines.types';

@Injectable({
  providedIn: 'root'
})
export class MagazinesService {

  private readonly URL = environment.appApiUrl + '/magazines';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Magazines[]> {
    return this.http.get<Magazines[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Magazines> {
    return this.http.get<Magazines>(`${this.URL}/${id}`);
  }

  createMagazinesForm(formData: Magazines): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
