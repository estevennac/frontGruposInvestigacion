import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostGradTesis } from 'src/app/types/postGradTesis.types';

@Injectable({
  providedIn: 'root'
})
export class PostGradTesisService {

  private readonly URL = environment.appApiUrl + '/post-grad-tesis';

  constructor(private http: HttpClient) {}


  getAll(): Observable<PostGradTesis[]> {
    return this.http.get<PostGradTesis[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<PostGradTesis> {
    return this.http.get<PostGradTesis>(`${this.URL}/${id}`);
  }

  createPostGradTesisForm(formData: PostGradTesis): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
}
