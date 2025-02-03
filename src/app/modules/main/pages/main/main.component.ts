// main.component.ts
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { UserRolService } from 'src/app/core/http/userRol/userRol.service';
import { RolService } from 'src/app/core/http/rol/rol.service';

@Component({
  selector: 'vex-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  datos: any;
  usuarioConectado: any;
  rolDetalles: any;

  constructor(
    private mainService: MainService,
    private rolService: RolService,
    private userRolService: UserRolService
  ) {}

  ngOnInit(): void {
  }




}
