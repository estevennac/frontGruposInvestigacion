import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AreaService } from 'src/app/core/http/area/area.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Area } from 'src/app/types/area.types';
import { Objectives } from 'src/app/types/specificobjectives.types';
import { ObjectivesService } from 'src/app/core/http/objectives/objectives.service';
import { StrategiesService } from 'src/app/core/http/strategies/strategies.service';
import { OdsService } from 'src/app/core/http/ods/ods.service';
import { Strategies } from 'src/app/types/strategies.types';
import { ODS } from 'src/app/types/ods.types';
@Component({
    selector: 'app-area',
    templateUrl: './modal_objetivos.component.html',
    styleUrls: ['../../../styles/modales.scss']
})
export class ObjControl implements OnInit {
    currentUser: string;
    currentDate: Date = new Date();
    obj: Objectives[] = [];
    form: FormGroup;
    isSaved: boolean = false;
    isLoading: boolean = false;
    isEditing: boolean = false; // Variable para determinar si se está en modo edición
    estrategias:Strategies[]=[];
    ods:ODS[]=[];
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        public dialogRef: MatDialogRef<ObjControl>,
        private objService: ObjectivesService,
        private odsService: OdsService,
        private strategieService: StrategiesService,
        @Inject(MAT_DIALOG_DATA) public data: any, // Datos que vienen del componente de la tabla
    ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.getUserName();
        this.loadData();
        // Inicializar el formulario
        this.form = this.fb.group({
            estrategia: ['', Validators.required], // Estrategia seleccionada
            ods: ['', Validators.required]          // ODS seleccionado
          });

    }
    loadData(): void {
        this.strategieService.getByObj(this.data.objetivoInstitucional).subscribe((data) => {
          this.estrategias = data.filter(estrategia => estrategia.estado === true);
          console.log(this.data.objetivoInstitucional)
        });
        this.odsService.getAll().subscribe((data) => {
          this.ods = data;
        });
      }
    

    onClickNo(obj): void {
        this.dialogRef.close(obj);
      }

      
 
      onClickClose(): void {
        this.dialogRef.close();
      }
      save(): void {
        const selectedEstrategia = this.form.value.estrategia;
        const selectedOds = this.form.value.ods;
    
        const result = {
          estrategias: [selectedEstrategia],
          ods: [selectedOds]
        };
    
        this.dialogRef.close(result);
      }
}
