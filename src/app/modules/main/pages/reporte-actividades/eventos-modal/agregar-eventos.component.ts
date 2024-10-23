import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-eventos',
  templateUrl: './agregar-eventos.component.html',
  styleUrls: ['../estilosModales.component.scss']
})
export class AgregarEventosComponent {
  eventsForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AgregarEventosComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
    this.eventsForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades], 
      nombre: ['', Validators.required],
      ciudad: ['', Validators.required], 
      pais: ['', Validators.required], 
      fecha: ['', [Validators.required, this.dateValidator]], 
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

  save() {
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

  cancel() {
    this.dialogRef.close(null);
  }

  dateValidator(control) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate >= currentDate || selectedDate.toDateString() === currentDate.toDateString() ? null : { futureOrCurrentDate: true };
  }
}
