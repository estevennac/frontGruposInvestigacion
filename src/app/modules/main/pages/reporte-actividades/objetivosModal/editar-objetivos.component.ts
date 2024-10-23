import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-objetivos',
  templateUrl: './editar-objetivos.component.html',
  styleUrls: ['../estilosModales.component.scss']
})
export class EditarObjetivosComponent {
  objStrategiesForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditarObjetivosComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.objStrategiesForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades],
      objetivo: [this.data.objetivo, Validators.required],
      estrategia: [this.data.estrategia, Validators.required],
      verificable: [this.data.verificable, Validators.required],
      cumplimiento: [this.data.cumplimiento, [Validators.required, this.validarPorcentaje]],
      usuarioCreacion: [''],
      fechaCreacion: [''],
      usuarioModificacion: [''],
      fechaModificacion: ['']
    });
    this.capitalizeFirstLetter();
  }

  capitalizeFirstLetter() {
    for (const controlName in this.objStrategiesForm.controls) {
      if (this.objStrategiesForm.controls.hasOwnProperty(controlName)) {
        const control = this.objStrategiesForm.controls[controlName];
        control.valueChanges.subscribe((value: string) => {
          if (value && typeof value === 'string' && value.length > 0) {
            control.setValue(value.charAt(0).toUpperCase() + value.slice(1), { emitEvent: false });
          }
        });
      }
    }
  }

  guardarCambios(): void {
    if (this.objStrategiesForm.valid) {
      this.dialogRef.close(this.objStrategiesForm.value);
      this.snackBar.open('Actualizado con éxito', 'Cerrar', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('Por favor, llene todos los campos requeridos', 'Cerrar', {
        duration: 2000,
      });
    }
  }

  validarPorcentaje(control) {
    const cumplimiento = control.value;
    if (cumplimiento < 0 || cumplimiento > 100) {
      return { 'rangoInvalido': true };
    }
    return null;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
