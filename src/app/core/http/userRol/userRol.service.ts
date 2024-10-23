
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/app/types/userRol.types';
import { UserApp } from 'src/app/types/userApp.types';

@Injectable({
  providedIn: 'root'
})
export class UserRolService {
  private readonly URL = environment.appApiUrl + '/user-roles';
  private readonly appUser = environment.appUsers; // Asegúrate de que esta propiedad esté definida correctamente

  constructor(private http: HttpClient) {}

  getAllUsersRol(): Observable<UserRoles[]> {
    return this.http.get<UserRoles[]>(`${this.URL}/`);
  }

  getUserRolById(idUser: number): Observable<UserRoles[]> {
    return this.http.get<UserRoles[]>(`${this.URL}/${idUser}`);
  }

  getUserApp(username: string, token: string): Observable<UserApp> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const options = {
      headers: headers
    };

    return this.http.get<UserApp>(`${this.appUser}${username}`, options);
  }

  getUserRolByUsername(username: string): Observable<UserRoles[]> {
    return this.http.get<UserRoles[]>(`${this.URL}/byusername/${username}`);
  }
  
  createUserRol(formData: UserRoles): Observable<any> {
    return this.http.post(`${this.URL}/create`, formData);
  }
  
  deleteUserRole(userId: number, roleId: number): Observable<any> {
    return this.http.delete(`${this.URL}/${userId}/roles/${roleId}`);
  }
}
