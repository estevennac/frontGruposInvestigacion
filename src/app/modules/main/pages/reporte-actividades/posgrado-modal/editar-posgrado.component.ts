import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-posgrado',
  templateUrl: './editar-posgrado.component.html',
  styleUrls: ['../estilosModales.component.scss']
})
export class EditarPosgradoComponent implements OnInit {
  posgradoForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditarPosgradoComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
    this.posgradoForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades], 
      nombre: [this.data.nombre, Validators.required],
      tesistas: [this.data.tesistas, Validators.required],
      usuarioCreacion: [''],
      fechaCreacion: [''],
      usuarioModificacion: [''],
      fechaModificacion: ['']
    });

    this.capitalizeFirstLetter();
  }

  capitalizeFirstLetter() {
    for (const controlName in this.posgradoForm.controls) {
      if (this.posgradoForm.controls.hasOwnProperty(controlName)) {
        const control = this.posgradoForm.controls[controlName];
        control.valueChanges.subscribe((value: string) => {
          if (value && typeof value === 'string' && value.length > 0) {
            control.setValue(value.charAt(0).toUpperCase() + value.slice(1), { emitEvent: false });
          }
        });
      }
    }
  }

  guardarCambios(): void {
    if (this.posgradoForm.valid) {
      this.dialogRef.close(this.posgradoForm.value);
      this.snackBar.open('Actualizado con éxito', 'Cerrar', {
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
}
