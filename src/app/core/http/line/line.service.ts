import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Line } from 'src/app/types/line.types';
import { LineArea } from 'src/app/types/line.types';
@Injectable({
  providedIn: 'root'
})
export class LineService {

  private readonly URL = environment.appApiUrl + '/line';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Line[]> {
    return this.http.get<Line[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Line> {
    return this.http.get<Line>(`${this.URL}/${id}`);
  }

  getLineByArea(id:number):Observable<Line[]>{
    return this.http.get<Line[]>(`${this.URL}/getLineByArea/${id}`);
  }
  getArea(id: number): Observable<LineArea> {
    return this.http.get<LineArea>(`${this.URL}/getAreaLine/${id}`);
  }

  createLineForm(formData: Line): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  update(id: number, formData: Line): Observable<Line> {
    return this.http.put<Line>(`${this.URL}/update/${id}`, formData);
  }
}
