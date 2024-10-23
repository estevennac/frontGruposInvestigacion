import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-eventos',
  templateUrl: './editar-eventos.component.html',
  styleUrls: ['../estilosModales.component.scss']
})
export class EditarEventosComponent implements OnInit {
  eventsForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditarEventosComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
    this.eventsForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades], 
      nombre: [this.data.nombre, Validators.required],
      ciudad: [this.data.ciudad, Validators.required],
      pais: [this.data.pais, Validators.required],
      fecha: [this.data.fecha, [Validators.required, this.dateValidator]], 
      usuarioCreacion: [''],
      fechaCreacion: [''],
      usuarioModificacion: [''],
      fechaModificacion: ['']
    });

    this.capitalizeFirstLetter();
  }

  capitalizeFirstLetter() {
    for (const controlName in this.eventsForm.controls) {
      if (this.eventsForm.controls.hasOwnProperty(controlName)) {
        const control = this.eventsForm.controls[controlName];
        control.valueChanges.subscribe((value: string) => {
          if (value && typeof value === 'string' && value.length > 0) {
            control.setValue(value.charAt(0).toUpperCase() + value.slice(1), { emitEvent: false });
          }
        });
      }
    }
  }

  guardarCambios(): void {
    if (this.eventsForm.valid) {
      this.dialogRef.close(this.eventsForm.value);
      this.snackBar.open('Se ha guardado con éxito', 'Cerrar', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('Por favor, llene todos los campos requeridos', 'Cerrar', {
        duration: 2000,
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  dateValidator(control) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate >= currentDate || selectedDate.toDateString() === currentDate.toDateString() ? null : { futureOrCurrentDate: true };
  }
}
