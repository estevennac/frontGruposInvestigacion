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

  private readonly URL = environment.appApiUrl + '/annualControl';

  constructor(private http: HttpClient) {}

  getByPanel(id: number): Observable<DtoAnnualControl[]>
  {
    return this.http.get<DtoAnnualControl[]>(`${this.URL}/AnnualPlan/${id}`);
  }

  getByPlanel(id: number): Observable<DtoAnnualControl[]>
  {
    return this.http.get<DtoAnnualControl[]>(`${this.URL}/ControlPanel/${id}`);
  }

  update(idPanel: number, idPlan:number): Observable<DtoAnnualControl>
  {
    return this.http.get<DtoAnnualControl>(`${this.URL + "/"}`);
  }

  createDtoAnnualControlForm(formData: DtoAnnualControl): Observable<any>
  {
    return this.http.post(`${this.URL}/create`, formData);
  }
}

