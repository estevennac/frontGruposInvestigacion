import { Component, OnInit } from "@angular/core";
import { ODS } from "src/app/types/ods.types";
import { OdsService } from "src/app/core/http/ods/ods.service";
import { OdsControl } from './modal_ods.component';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';

@Component({
  selector: "app-ods-list",
  templateUrl: "./ods.component.html",
  styleUrls: ["../modulos.component.scss"],
})
export class OdsComponent implements OnInit {
    ods: ODS[] = [];

    constructor(private odsService: OdsService, private dialog: MatDialog
      ,private router: Router,
    ) {}
    

ngOnInit(){
  this.get();
}

get() {
  this.odsService.getAll().subscribe((data)=>{
    this.ods = data;
  })
}

openDialog(ods?: ODS): void {
  const dialogRef = this.dialog.open(OdsControl, {
    width: '50%',
    height: '70%',
    data: { ods } 
  });
}
edit(id: number) {
  this.odsService.getById(id).subscribe(
      (ods: ODS) => {
          this.openDialog(ods); // Abrir el modal con los datos para editar
      },
      (error) => {
          console.error('Error al obtener los detalles del area', error);
      }
  );
}
goBack() {
  this.router.navigate(['main/admin']);
}

}