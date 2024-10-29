import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InstStrategicObj } from 'src/app/types/InstStrategicObj.types';

@Injectable({
  providedIn: 'root'
})
export class InstStrategicObjService {

  private readonly URL = environment.appApiUrl + '/instStrategicObj';

  constructor(private http: HttpClient) { }

  getAll(): Observable<InstStrategicObj[]>{
    return this.http.get<InstStrategicObj[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<InstStrategicObj>{
    return this.http.get<InstStrategicObj>(`${this.URL}/${id}`); 
  }

  createInstStrategicObjForm(formData: InstStrategicObj): Observable<any> {
    return this.http.post(`${this.URL}/create`,formData);
  }

  update(id: number, formData: InstStrategicObj): Observable<InstStrategicObj> {
    return this.http.put<InstStrategicObj>(`${this.URL}/update/${id}`, formData)
  }
}
