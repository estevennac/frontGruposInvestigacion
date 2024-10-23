import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResearchProject } from 'src/app/types/research-project.types';

@Injectable({
  providedIn: 'root'
})
export class ResearchProjectService {

  private readonly URL = environment.appApiUrl + '/research-projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResearchProject[]> {
    return this.http.get<ResearchProject[]>(`${this.URL}/`);
  }

  getById(id: number): Observable<ResearchProject> {
    return this.http.get<ResearchProject>(`${this.URL}/${id}`);
  }

  createResearchProject(formData: ResearchProject): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  updateResearchProject(id: number, formData: ResearchProject): Observable<any> {
    return this.http.put(`${this.URL}/update/${id}`, formData);
  }
}
