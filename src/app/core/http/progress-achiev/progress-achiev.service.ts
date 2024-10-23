import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressAchiev } from 'src/app/types/progressAchiev.types';

@Injectable({
  providedIn: 'root'
})
export class ProgressAchievService {

  private readonly URL = environment.appApiUrl + '/progress-ach';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ProgressAchiev[]> {
    return this.http.get<ProgressAchiev[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<ProgressAchiev> {
    return this.http.get<ProgressAchiev>(`${this.URL}/${id}`);
  }

  createProgressAchievForm(formData: ProgressAchiev): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
