import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-posgrado',
  templateUrl: './agregar-posgrado.component.html',
  styleUrls: ['../estilosModales.component.scss']
})
export class AgregarPosgradoComponent implements OnInit {
  posgradoForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AgregarPosgradoComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.posgradoForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades],
      nombre: ['', Validators.required],
      tesistas: ['', Validators.required],
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

  save() {
    if (this.posgradoForm.valid) {
      this.dialogRef.close(this.posgradoForm.value);
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
}
