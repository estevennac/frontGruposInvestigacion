import { Component, OnInit } from "@angular/core";
import { Ods } from "src/app/types/ods.types";
import { OdsService } from "src/app/core/http/ods/ods.service";
import { OdsControl } from './modal_ods.component';
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-ods-list",
  templateUrl: "./ods.component.html",
  styleUrls: ["../modulos.component.scss"],
})
export class OdsComponent implements OnInit {
    ods: Ods[] = [];

    constructor(private odsService: OdsService, private dialog: MatDialog) {}
    private dialog: MatDialog;
) {}

ngOnInit(){
  this.get();
}

get() {
  this.odsService.getAll().subscribe((data)=>{
    this.area = data;
  })
}

openDialog(area?: Ods): void {
  const dialogRef = this.dialog.open(OdsControl, {
    width: '50%',
    height: '70%',
    data: { area } 
  });
}

}