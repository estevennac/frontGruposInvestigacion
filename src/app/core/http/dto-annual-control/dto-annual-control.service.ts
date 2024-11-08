import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DtoAnnualControl } from "src/app/types/dtoAnnualControl.types";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable
({
  providedIn: 'root'
})
export class DtoAnnualControlService
{

  private readonly URL = environment.appApiUrl + '/dtoAnnualControls';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DtoAnnualControl[]>
  {
    return this.http.get<DtoAnnualControl[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<DtoAnnualControl>
  {
    return this.http.get<DtoAnnualControl>(`${this.URL}/${id}`);
  }

  createDtoAnnualControlForm(formData: DtoAnnualControl): Observable<any>
  {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: DtoAnnualControl): Observable<DtoAnnualControl>
  {
    return this.http.put<DtoAnnualControl>(`${this.URL}/update/${id}`, formData);
  }
}

