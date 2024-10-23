import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChecklistForm } from 'src/app/types/checklist.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  private readonly URL = environment.appApiUrl + '/checklist';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ChecklistForm[]> {
    return this.http.get<ChecklistForm[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<ChecklistForm> {
    return this.http.get<ChecklistForm>(`${this.URL}/${id}`);
  }

  createChecklistForm(formData: ChecklistForm): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  
  getByGroup(id: number): Observable<ChecklistForm> {
    return this.http.get<ChecklistForm>(`${this.URL}/byGroup/${id}`);
  }
  update(id: number, formData: ChecklistForm): Observable<ChecklistForm> {
    return this.http.put<ChecklistForm>(`${this.URL}/update/${id}`, formData);
  }


}




