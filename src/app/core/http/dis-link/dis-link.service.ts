import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisLink } from 'src/app/types/disLink.types';

@Injectable({
  providedIn: 'root'
})
export class DisLinkService {

  private readonly URL = environment.appApiUrl + '/dislinks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DisLink[]> {
    return this.http.get<DisLink[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<DisLink> {
    return this.http.get<DisLink>(`${this.URL}/${id}`);
  }

  createDisLinkForm(formData: DisLink): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
