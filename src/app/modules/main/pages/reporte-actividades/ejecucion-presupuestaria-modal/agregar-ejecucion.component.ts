import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-ejecucion',
  templateUrl: './agregar-ejecucion.component.html',
  styleUrls: ['../estilosModales.component.scss']
})
export class AgregarEjecucionComponent implements OnInit {
  ejecucionForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AgregarEjecucionComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
    this.ejecucionForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades], 
      item: ['', Validators.required],
      valorAsignado: ['', Validators.required], 
      valorComprometido: ['', Validators.required], 
      valorAcumulado: ['', Validators.required], 
      bienesAdquiridos: ['', Validators.required], 
      usuarioCreacion: [''],
      fechaCreacion: [''],
      usuarioModificacion: [''],
      fechaModificacion: ['']
    });

    this.capitalizeFirstLetter();
  }

  capitalizeFirstLetter() {
    for (const controlName in this.ejecucionForm.controls) {
      if (this.ejecucionForm.controls.hasOwnProperty(controlName)) {
        const control = this.ejecucionForm.controls[controlName];
        control.valueChanges.subscribe((value: string) => {
          if (value && typeof value === 'string' && value.length > 0) {
            control.setValue(value.charAt(0).toUpperCase() + value.slice(1), { emitEvent: false });
          }
        });
      }
    }
  }

  save() {
    if (this.ejecucionForm.valid) {
      this.dialogRef.close(this.ejecucionForm.value);
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
