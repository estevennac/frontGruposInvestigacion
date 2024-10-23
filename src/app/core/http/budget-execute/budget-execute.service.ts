import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BudgetExecute } from 'src/app/types/budgetExecute.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetExecuteService {

  private readonly URL = environment.appApiUrl + '/budget-executes';

  constructor(private http: HttpClient) {}


  getAll(): Observable<BudgetExecute[]> {
    return this.http.get<BudgetExecute[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<BudgetExecute> {
    return this.http.get<BudgetExecute>(`${this.URL}/${id}`);
  }

  createBudgetExecuteForm(formData: BudgetExecute): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: BudgetExecute): Observable<BudgetExecute> {
    return this.http.put<BudgetExecute>(`${this.URL}/update/${id}`, formData);
  }}
