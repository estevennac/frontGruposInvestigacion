import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpecificObjetives } from 'src/app/types/specificObjetives.types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecificObjetivesService {
  private readonly URL = environment.appApiUrl + '/objectives';

  constructor(private http: HttpClient) { }

  getAll(): Observable<SpecificObjetives[]> {
    return this.http.get<SpecificObjetives[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<SpecificObjetives>{
    return this.http.get<SpecificObjetives>(`${this.URL}/${id}`);
  }

  createSpecificObjetive(formData: SpecificObjetives): Observable<any>{
    return this.http.post(`${this.URL}/create`,formData);
  }
  
  update(id: number, formData: SpecificObjetives): Observable<SpecificObjetives>{
    return this.http.put<SpecificObjetives>(`${this.URL}/update/${id}`,formData);
  }

}
