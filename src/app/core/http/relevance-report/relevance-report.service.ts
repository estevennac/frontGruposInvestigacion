import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RelevanceReport } from 'src/app/types/relevancereport.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelevanceReportService {

  private readonly URL = environment.appApiUrl + '/relevance-report'

  constructor(private http: HttpClient) { }

  getAll(): Observable<RelevanceReport[]>{
    return this.http.get<RelevanceReport[]>(`${this.URL}/`);
  }

  getById(id: number): Observable<RelevanceReport>{
    return this.http.get<RelevanceReport>(`${this.URL}/${id}`);
  }

  createRelevanceReport(formData: RelevanceReport): Observable<any>{
    return this.http.post(`${this.URL}/create`,formData);
  }

  updateRelevanceReport(id:number, formData: RelevanceReport): Observable<any>{
    return this.http.put(`${this.URL}/update/${id}`,  formData)
  }
}
