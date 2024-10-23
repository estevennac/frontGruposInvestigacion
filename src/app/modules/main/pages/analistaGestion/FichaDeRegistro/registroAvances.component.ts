import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment'; // Importamos moment para formatear la fecha

@Component({
    selector:'app-avances',
    templateUrl:'./registroAvances.component.html',
    styleUrls:['./ficha.component.scss']
})
export class Avances implements OnInit {
    avanceForm: FormGroup;
    avances:any;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<Avances>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.avanceForm = this.fb.group({
            fechaLogro: ['', Validators.required],
            logro: ['', Validators.required],
            descripcion: ['', Validators.required],
        });
    }

    enviarAvance(): void {
        console.log("llego");

        if (this.avanceForm.valid) {
            const fechaLogroFormatted = moment(this.avanceForm.value.fechaLogro).format('YYYY-MM-DD HH:mm:ss');
            const avanceData = {
                fechaLogro: fechaLogroFormatted,
                logro: this.avanceForm.value.logro,
                descripcion: this.avanceForm.value.descripcion
            };
            this.avances=avanceData;
            console.log(this.avances);
            this.dialogRef.close(avanceData); // Envía el valor del formulario al componente padre
        } else {
            // Marca los controles del formulario como tocados para mostrar los errores
            Object.values(this.avanceForm.controls).forEach(control => {
                control.markAsTouched();
                console.log("errros")
            });
        }
    }

    onClickNo(): void {
        this.dialogRef.close(); // Cierra el modal sin enviar ningún valor
    }
}
