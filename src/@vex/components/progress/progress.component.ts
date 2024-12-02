import { Component, OnInit, Input } from '@angular/core';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() id!: number; // Recibimos el id desde el componente padre
  grupo: InvGroupForm; // Almacenamos los datos del grupo

  steps: { label: string, state: string }[] = []; // Arreglo para los pasos

  constructor(private invGroupService: InvGroupService,
              private creationRequestService: CreationReqService) {}

  ngOnInit(): void {
    // Solicitamos los datos con el ID proporcionado
    this.invGroupService.getById(this.id).subscribe((data) => {
      console.log(data);
      this.grupo = data;
      this.setSteps(); // Configuramos los pasos con base en el estado
    });
  }

  // Configuración de los pasos según el estado del grupo
  setSteps() {
    const currentStep = this.grupo.estadoGrupoInv; // Este es el estado como string (ej. 'revDirDep', 'revInf', etc.)

    // Configuración de los pasos
    this.steps = [
      { label: '1.- Presentar solicitud de creación de GI', state: '1' },
      { label: '2.- Plan de Desarrollo', state: '2' },
      { label: '3.- Propuesta de creación del GI', state: '3' },
      { label: '4.- Solicitando informe de pertinencia del GI', state: 'revDirDep' },
      { label: '5.- Validación de Información', state: 'solInfPer' },
      { label: '6.- Resolución en Consejo de Departamento', state: 'revConsejo' },
      { label: '7.- Presentación de Solicitud al VITT', state: '' },
      { label: '8.- Delegando revisión al Comité de Investigación', state: '' },
      { label: '9.- Emisión de Criterio de Solicitud', state: '' },
      { label: '10.- Remitido al Consejo Académico', state: '' },
      { label: '11.- Comité Académico emitiendo resolución', state: '' },
      { label: '12.- El VITT está revisando la resolución de inscripción', state: '' },
    ];

    // Asignar estado dinámico a cada paso
    this.steps.forEach((step, index) => {
      if (this.isStepCompleted(step.state, currentStep)) {
        step.state = 'completed'; // Pasos completados
      } else if (step.state === currentStep) {
        step.state = 'current'; // Paso en proceso
      } else {
        step.state = 'pending'; // Pasos pendientes
      }
    });
  }

  // Función para determinar si un paso está completado
  isStepCompleted(stepState: string, currentStep: string): boolean {
    // Los pasos se consideran completados si ya pasaron antes del paso actual
    const stepOrder = ['1', '2', '3', 'revDirDep', 'solInfPer', 'revConsejo']; // Aquí ordenamos los pasos que se han completado antes
    const stepIndex = stepOrder.indexOf(stepState); // Obtenemos el índice del estado del paso

    // Si el paso está antes del estado actual, lo consideramos completado
    return stepIndex !== -1 && stepOrder.indexOf(currentStep) > stepIndex;
  }
}
