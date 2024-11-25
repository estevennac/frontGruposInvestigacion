import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvGroup_area,CreaAreaCompleto } from 'src/app/types/invGroup_area.types';
import { Area } from 'src/app/types/area.types';

@Injectable({
  providedIn: 'root'
})
export class InvGroup_areaService {

  private readonly URL = environment.appApiUrl + '/invGroup_area';

  constructor(private http: HttpClient) {}


  getAll(): Observable<InvGroup_area[]> {
    return this.http.get<InvGroup_area[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InvGroup_area> {
    return this.http.get<InvGroup_area>(`${this.URL}/${id}`);
  }
  createAreaCreaForm(formData: InvGroup_area): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  getByGroup(id: number): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.URL}/byGroup/${id}`);
  }
}
