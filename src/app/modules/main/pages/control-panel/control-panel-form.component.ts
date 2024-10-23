import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlPanelService } from 'src/app/core/http/control-panel/control-panel.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-tu-componente',
  templateUrl: './control-panel-form.component.html',
  styleUrls: ['./control-panel-form.component.scss']
})
export class ControlPanelFormComponent implements OnInit {

  savedMessage: string;
  controlPanelForm: FormGroup;
  controlPanelForms: any[] = [];

  constructor(
    private fb: FormBuilder,
    private controlPanelFormService: ControlPanelService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.controlPanelForm = this.fb.group({

      idPanelControl: [null],
      idPlanDesarrollo: [null],
      numeroPanelControl: [null],
      actividad: [null],
      indicador: [null],
      meta1: [null],
      meta2: [null],
      observacion: [null],

      usuarioCreacionPanelControl: [null], 
      fechaCreacionPanelControl: [null],    
      usuarioModificacionPanelControl: [null],  
      fechaModificacionPanelControl: [null],   
    });
  }

  getAll() {
    this.controlPanelFormService.getAll().subscribe((data) => {
      this.controlPanelForms = data;
      console.log("datos:", data)
    });
  }

  createControlPanelForm(): void {
    if (this.controlPanelForm.valid) {
      const currentUser = this.authService.getUserName();
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  
      this.controlPanelForm.get('usuarioCreacionPanelControl').setValue(currentUser);
      this.controlPanelForm.get('fechaCreacionPanelControl').setValue(currentDate);
      this.controlPanelForm.get('usuarioModificacionPanelControl').setValue(currentUser);
      this.controlPanelForm.get('fechaModificacionPanelControl').setValue(currentDate);

      this.controlPanelForm.get('idPlanDesarrollo').setValue(1);

      const formData = this.controlPanelForm.value;
      console.log('Objeto del formulario antes de enviar:', formData);
  
      this.controlPanelFormService.createControlPanelForm(formData).subscribe(
        (response) => {
          console.log('Formulario enviado con éxito:', response);
          this.savedMessage = 'Formulario guardado con éxito';
          setTimeout(() => {
            this.savedMessage = null;
            this.router.navigate(['/main']);
          }, 3000);
        },
        (error) => {
          console.error('Error al enviar el formulario:', error);
          this.savedMessage = 'Error al guardar el formulario';
        }
      );
    } else {
      console.error('El formulario no es válido. Verifica los campos.');
      this.savedMessage = 'Verifica los campos del formulario';
    }
  }
  
  
}
