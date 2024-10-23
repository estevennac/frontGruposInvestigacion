import { Component, OnInit } from '@angular/core';
import {UserRolService } from '../../../../core/http/userRol/userRol.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol.component.html',
 // styleUrls: ['./ejemplo.component.scss'],
})

export class UserRolListComponent implements OnInit {
  urol: any[] = [];

  constructor(private router: Router, private urolService: UserRolService) {}

  ngOnInit() {
    this.getUrol();
  }

  getUrol() {
    this.urolService.getAllUsersRol().subscribe((data) => {
      this.urol = data;
      console.log("datos:",data)
    });
  }
  

}

