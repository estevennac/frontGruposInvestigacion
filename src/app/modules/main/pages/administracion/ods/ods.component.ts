import { Component, OnInit } from "@angular/core";
import { ODS } from "src/app/types/ods.types";
import { Router } from '@angular/router';
import { OdsService } from "src/app/core/http/ods/ods.service";
import { OdsControl } from './modal_ods.component';
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-ods-list",
  templateUrl: "./ods.component.html",
  styleUrls: ["../modulos.component.scss"],
})
export class OdsComponent implements OnInit {
  ods: ODS[] = [];

  constructor(private router: Router, private odsService: MatDialog,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.get();
  }

get() {
  this.odsService.getAll().subscribe((data) => {
    this.ods = data;
  })
}

openDialog(ods ?: ODS): void {
  const dialogRef = this.dialog.open(OdsControl, {
    width: '50%',
    height: '70%',
    data: { ods }
  });

  DialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.get();
    }
  });
}

edit(id: number) {
  this.odsService.getById(id).subscribe(
    (area: ODS) => {
      this.openDialog(area); // Abrir el modal con los datos para editar
    },
    (error) => {
      console.error('Error al obtener los detalles del area', error);
    }
  );
}

deletee(id: number) {
  this.odsService.update(id, { estado: false }).subscribe(
    () => {
      console.log(`ODS con ID ${id} eliminado correctamente`);
      this.get();
    },
    (error) => {
      console.error('Error al eliminar el dominio académico', error);
    }
  );
}

active(id: number) {
  this.odsService.update(id, { estado: true }).subscribe(
    () => {
      console.log(`ODS con ID ${id} eliminado correctamente`);
      this.get();
    },
    (error) => {
      console.error('Error al eliminar el dominio académico', error);
    }
  );
}
goBack() {
  this.router.navigate(['main/admin']);
}
}
