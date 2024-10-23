import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivityReport } from 'src/app/types/activityReport.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private readonly apiUrl = environment.appDocuments;

  constructor(private http: HttpClient) {}


  getDocument(token: string, uiidFile: string, filename: string): Observable<any>{
    const headers={
      Authorization: `Bearer ${token}`
    }
    return this.http.get(this.apiUrl+'getFile', { 
      headers: headers,
      params: {
        uiidFile: uiidFile,
        filename: filename
      },
      responseType: 'blob' // si se espera una respuesta de tipo blob
    });
  }

  
  saveDocument(token: string, file: File, sistema: string): Observable<any> {
    // Definir los headers con el token de autorización
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    // Construir el cuerpo de la solicitud
    const formData = new FormData();
    formData.append('files', file, file.name);
    formData.append('sistema', sistema);

    // Realizar la solicitud POST con los headers y el cuerpo
    return this.http.post(this.apiUrl+'saveFile', formData, { headers: headers });
  }



}
