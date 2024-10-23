import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Events } from 'src/app/types/events.types';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private readonly URL = environment.appApiUrl + '/events';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<Events> {
    return this.http.get<Events>(`${this.URL}/${id}`);
  }

  createEventsForm(formData: Events): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
