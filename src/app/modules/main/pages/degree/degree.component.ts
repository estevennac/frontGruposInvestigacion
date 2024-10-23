import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent {
  id: string = '';
  apiResponse: string = '';

  constructor(private http: HttpClient) { }

  onIdInput(event: any) {
    this.id = event.target.value;
  }

  verifyDocuments() {
    const requestBody = this.id;
    this.http.post('http://localhost:8080/api/v1.0/verifyDocuments', requestBody)
      .subscribe((response: any) => {
        this.apiResponse = response.message;
      });
  }
}
