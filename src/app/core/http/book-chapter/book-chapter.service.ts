import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BookChapter } from 'src/app/types/bookChapter.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookChapterService {

  private readonly URL = environment.appApiUrl + '/book-chapters';

  constructor(private http: HttpClient) {}


  getAll(): Observable<BookChapter[]> {
    return this.http.get<BookChapter[]>(`${this.URL + "/"}`);
  }

  getById(id: number): Observable<BookChapter> {
    return this.http.get<BookChapter>(`${this.URL}/${id}`);
  }

  createBookChaptersForm(formData: BookChapter): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }

  update(id: number, formData: BookChapter): Observable<BookChapter> {
    return this.http.put<BookChapter>(`${this.URL}/update/${id}`, formData);
  }}
