import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetsReport } from 'src/app/types/assetsReport.types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsReportService {
  private readonly URL = environment.appApiUrl + '/assets-report'

  constructor(private http: HttpClient) { }

  getAll(): Observable<AssetsReport[]>{
    return this.http.get<AssetsReport[]>(`${this.URL}/`);
  }

  getById(id: number): Observable<AssetsReport>{
    return this.http.get<AssetsReport>(`${this.URL}/${id}`);
  }

  createAssetsReport(formData: AssetsReport): Observable<any>{
    return this.http.post(`${this.URL}/created`,formData);
  }

  updateAssetsReport(id:number, formData: AssetsReport): Observable<any>{
    return this.http.put(`${this.URL}/update/${id}`,formData);
  }
}
