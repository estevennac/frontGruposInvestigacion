import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-proyectos',
  templateUrl: './agregar-proyectos.component.html',
  styleUrls: ['./estilosProyectos.scss']
})
export class AgregarProyectosComponent implements OnInit {
  projectsForm: FormGroup;
  tipoOpciones = ['Interno', 'Externo', 'Investigación', 'Vinculación'];
  estadoOpciones = ['En ejecución', 'Finalizado'];

  constructor(
    private dialogRef: MatDialogRef<AgregarProyectosComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.projectsForm = this.formBuilder.group({
      idInformeActividades: [this.data.idInformeActividades],
      titulo: ['', Validators.required],
      entidadFinanciera: ['', Validators.required],
      institucionColaboradora: ['', Validators.required],
      horas: ['', Validators.required],
      minutos: ['', Validators.required],
      presupuesto: ['', Validators.required],
      responsable: ['', Validators.required],
      participantes: ['', Validators.required],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      usuarioCreacion: [''],
      fechaCreacion: [''],
      usuarioModificacion: [''],
      fechaModificacion: ['']
    });

    this.capitalizeFirstLetter();
  }

  capitalizeFirstLetter() {
    for (const controlName in this.projectsForm.controls) {
      if (this.projectsForm.controls.hasOwnProperty(controlName)) {
        const control = this.projectsForm.controls[controlName];
        control.valueChanges.subscribe((value: string) => {
          if (value && typeof value === 'string' && value.length > 0) {
            control.setValue(value.charAt(0).toUpperCase() + value.slice(1), { emitEvent: false });
          }
        });
      }
    }
  }

  save() {
    if (this.projectsForm.valid) {
      this.dialogRef.close(this.projectsForm.value);
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
