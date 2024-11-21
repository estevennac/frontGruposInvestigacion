import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpperLevelPlanService } from 'src/app/core/http/upperLevel-plan/upper-level-plan.service';
import { LegalFrameworkService } from 'src/app/core/http/legal-framework/legalFramework.service';
import { NationalPlanService } from 'src/app/core/http/national-plan/national-plan.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DeveLegaService } from 'src/app/core/http/deve-lega/deve-lega.service';
import { DeveNationalService } from 'src/app/core/http/deve-national/deve-national.service';
import { DeveUppeService } from 'src/app/core/http/deve-uppe/deve-uppe.service';
import { DevelopmentPlanService } from 'src/app/core/http/develop-plan-form/develop-plan-form.service';
import { DevelopmentPlanForms } from 'src/app/types/developPlanForm';
import { DatePipe } from '@angular/common';
import { DeveNati } from 'src/app/types/deveNati.types';
import { DeveUppe } from 'src/app/types/deveUppe.types';
import { DeveLegaForm } from 'src/app/types/deveLega.types';
import { ObjectivesService } from 'src/app/core/http/objectives/objectives.service';
import { StrategiesService } from 'src/app/core/http/strategies/strategies.service';
import { ControlPanelService } from 'src/app/core/http/control-panel/control-panel.service';
import { Objectives } from 'src/app/types/specificobjectives.types';
import { Strategies } from 'src/app/types/strategies.types';
import { ControlPanelForm } from 'src/app/types/controlPanel.types';
import { fadeInUpAnimation } from 'src/@vex/animations/fade-in-up.animation';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InstStrategicObj } from 'src/app/types/InstStrategicObj.types';
import { InstStrategicObjService } from 'src/app/core/http/instStrategicObj/inst-strategic-obj.service';
import { OdsService } from 'src/app/core/http/ods/ods.service';
import { ODS } from 'src/app/types/ods.types';
import { ObjStrategiesODSService } from 'src/app/core/http/obj_strategies_ods/obj_strategies_ods.service';
import { Objectives_Strategies_Ods } from 'src/app/types/obj_strategies_ods.types';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { ObjControl } from './modal_objetivos.component';
import { ChangeDetectorRef } from '@angular/core';
import { ActControl } from './modal_cuadro_actividades.component';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
@Component({
  selector: 'vex-creation-form',
  templateUrl: './development-plan.html',
  styleUrls: ['../creation-form.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class DevelopmentPlanFormComponent implements OnInit {
  idGroup: number;
  isLinear = true; // Stepper will be linear (cannot skip steps)
  planSuperior: any[] = [];
  marcoLegal: any[] = [];
  planNacional: any[] = [];
  idPlanDesarrollo: number;
  planSuperiorControl = new FormControl<any>(0, Validators.required);
  alcanceControl = new FormControl("", Validators.required);
  contextoControl = new FormControl("", Validators.required);
  objGeneralControl = new FormControl("", Validators.required);
  objEstrategicoControl = new FormControl("", Validators.required);
  marcoControl = new FormControl<any>(0, Validators.required);
  planNacionalControl = new FormControl<any>(0, Validators.required);
  objetivoInstitucionalControl = new FormControl<any>(0, Validators.required);
  odsControl = new FormControl<any>(0, Validators.required);
  myForm: FormGroup;
  currentUser: string;
  currentDate: any;
  objetivoInstitucional: InstStrategicObj[];
  ods:ODS[];
  estrategias:Strategies[];
  obj:any[]=[];
  usuarioNombre: {[key:number]: string}= {};
  constructor(
    private fb: FormBuilder,
    private upperLevelPlanService: UpperLevelPlanService,
    private legalFrameworkService: LegalFrameworkService,
    private nationalPlanService: NationalPlanService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute,
    private develegaService: DeveLegaService,
    private deveUppeService: DeveUppeService,
    private deveNationalService: DeveNationalService,
    private developmentPlanService: DevelopmentPlanService,
    private datePipe: DatePipe,
    private objService: ObjectivesService,
    private strategieService: StrategiesService,
    private controlPanelService: ControlPanelService,
    private creationReqService: CreationReqService,
    private invGroupService: InvGroupService,
    private objInstitucionalService:InstStrategicObjService,
    private odsService: OdsService,
    private strategiesService:StrategiesService,
        private dialog: MatDialog,
         private cdr: ChangeDetectorRef,
         private usuarioService: UsuarioService
        


  ) {this.obj=[];
    /*this.myForm = this.fb.group({
  
      planDesarrolloForm3: this.fb.group({
        objetivos: this.fb.array([
          this.agregarObjetivo()

        ])       }),
      planDesarrolloForm4: this.fb.group({
        actividades: this.fb.array([]),
      }),
    });*/
     // Agrega un objetivo inicial


  }
  public formReady: boolean = false; // Bandera para indicar si el formulario está listo

  public isLoading: boolean = true; // Inicializar como true para que el spinner aparezca al inicio

  ngOnInit(): void {
    this.loadData().subscribe(() => {
      this.cargaFormularios();
      this.formReady = true;
    });
    this.idGroup = Number(sessionStorage.getItem("invGroup"))
    this.currentUser = this.authService.getUserName();
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  }
  cargaFormularios(){ 
    this.myForm = this.fb.group({
      planDesarrolloForm1: this.fb.group({
        planSuperior: this.planSuperiorControl,
        marco: this.marcoControl,
        planNacional: this.planNacionalControl,
      }),
      planDesarrolloForm2: this.fb.group({
        alcance: this.alcanceControl,
      }),
      planDesarrolloForm2_1: this.fb.group({
        contexto: this.contextoControl,
      }),
      planDesarrolloForm2_2: this.fb.group({
        objInstitucional: this.objetivoInstitucionalControl,
        objGeneral: this.objGeneralControl,
        //objEstrategico: this.objEstrategicoControl,//eliminar este
      }),
      planDesarrolloForm3: this.fb.array([
        this.crearObjetivo() // Inicializamos con al menos un grupo en el FormArray
      ]),
      planDesarrolloForm4: this.fb.array([      ]
        
      ),
    });
    this.planSuperiorControl.setValue([this.planSuperior[0].idPlanNivelSuperior]); // ID del plan que deseas seleccionar por defecto
    this.marcoControl.setValue([this.marcoLegal[0].idMarcoLegal]);        // ID del marco que deseas seleccionar por defecto
    this.planNacionalControl.setValue([this.planNacional[0].idPlanNacional]); // ID del plan nacional que deseas seleccionar por defecto

  }

  get planDesarrolloForm1() {
    return this.myForm.get('planDesarrolloForm1') as FormGroup;
  }
  get planDesarrolloForm2() {
    return this.myForm.get('planDesarrolloForm2') as FormGroup;
  }
  get planDesarrolloForm2_1() {
    return this.myForm.get('planDesarrolloForm2_1') as FormGroup;
  }
  get planDesarrolloForm2_2() {
    return this.myForm.get('planDesarrolloForm2_2') as FormGroup;
  }
  get planDesarrolloForm3() {
    return this.myForm.get('planDesarrolloForm3') as FormGroup;
  }
  get planDesarrolloForm4() {
    return this.myForm.get('planDesarrolloForm4') as FormGroup;

  }
  get objetivos(): FormArray {
    return this.myForm.get('planDesarrolloForm3') as FormArray;
  }
  
  get marco():FormArray{
    return this.myForm.get('planDesarrolloForm4') as FormArray;
  }
  
  trackByFn(index: number, item: any): number {
    return index; // O cualquier identificador único
  }
  
  loadData() {
    return forkJoin({
      planSuperior: this.upperLevelPlanService.getAll(),
      marcoLegal: this.legalFrameworkService.getAll(),
      planNacional: this.nationalPlanService.getAll(),
      objetivoInstitucional: this.objInstitucionalService.getAll(),
      estrategias: this.strategiesService.getAll(),
      ods:this.odsService.getAll(),
    }).pipe(
      map((response) => {
        this.planSuperior = response.planSuperior.filter((plan) => plan.estado === true);
        this.marcoLegal = response.marcoLegal.filter((marco) => marco.estado === true);
        this.planNacional = response.planNacional.filter((plan) => plan.estado === true);
        this.objetivoInstitucional = response.objetivoInstitucional.filter((obj) => obj.estado === true);
        this.estrategias = response.estrategias.filter((estrategia) => estrategia.estado === true);
        this.ods=response.ods;
      })
    );
  }
 objs:number[]=[1];
 
 crearObjetivo(): FormGroup {
  return this.fb.group({
    objetivo: [''], // Campo objetivo dentro del FormGroup
    estrategias: [[]],         // Inicializamos como un arreglo vacío
    ods: [[]]   
  });
}

crearMarco(): FormGroup {
  return this.fb.group({
    idPlanDesarrollo: [null, Validators.required],
    idObjetivoEspecifico: [null, Validators.required],
    idResponsable: [null, Validators.required],
    actividad: ['', Validators.required],
    indicadorNombre: ['', Validators.required],
    indicadorTipo: ['', Validators.required],
    indicadorForma: ['', Validators.required],
    indicadorCondicional: ['', Validators.required],
    indicadorAcumulativo: ['', Validators.required],
    meta1: [null, Validators.required],
    meta2: [null, Validators.required],
    meta3: [null, Validators.required],
    meta4: [null, Validators.required],
    financiamiento: [null, Validators.required],
    observacion: ['', Validators.required]
  });
}


agregarObjetivo(): void {
  if (this.objetivos) {
    this.objetivos.push(this.crearObjetivo());
  } else {
    console.error('El FormArray "objetivos" no está definido.');
  }
}

getObjetivoEspecifico(posicion: number): string {
  const objetivo = this.objetivos.value[posicion];  // Usar la posición para acceder al arreglo
  return objetivo ? objetivo.objetivo : 'Objetivo no encontrado';  // Ajusta según el campo que quieras mostrar
}
/*
getName(id: number): Observable<string> {
  //console.log('ID:', id);
  return this.usuarioService.getById(id).pipe(
    map(data => data?.nombre || 'Usuario no encontrado'),  // Si no hay nombre, retorna "Usuario no encontrado"
    catchError(() => of('Usuario no encontrado'))  // Si hay un error (usuario no encontrado, etc.), retorna "Usuario no encontrado"
  );
}*/

getName(id: number): Observable<string> {
  if (!this.usuarioNombre) {
    this.usuarioNombre = {};
  }

  if (this.usuarioNombre[id]) {
    return of(this.usuarioNombre[id]);
  }

  //Solicitud al backend
  return this.usuarioService.getById(id).pipe(
    map((usuario) => {
      const nombre = usuario?.nombre || 'Usuario no encontrado';
      this.usuarioNombre[id] = nombre; // Almacena el resultado en usuarioNombre
      return nombre;
    }),
    catchError(() => {
      const errorNombre = 'Usuario no encontrado';
      this.usuarioNombre[id] = errorNombre; // También almacena el mensaje de error
      return of(errorNombre);
    })
  );

}

agregarMarco(): void {
  const dialogRef = this.dialog.open(ActControl, {
    width: '80%',
    height: '90%',
    data: {
      objetivos: this.objetivos.value
    }
  });

  // Cuando se cierra el modal, verificar si hay datos y agregar al FormArray
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Aquí agregamos el nuevo marco al FormArray
      const newMarco = this.crearMarco();
      newMarco.patchValue(result);  // Asignar los valores que se ingresaron en el modal
      this.marco.push(newMarco);    // Agregar el marco al FormArray

      console.log('Nuevo marco agregado:', newMarco.value);
      console.log(`cs:`, this.marco.value);

    }
  });
}

eliminarObjetivo(index: number): void {
  if (this.objetivos.length > 1) {
    this.objetivos.removeAt(index);
  }
}

eliminarMarco(index: number): void {
  if (this.marco.length > 1) {
    this.marco.removeAt(index);
  } else {
    console.error('No se puede eliminar el último marco');
  }
}

openDialogObj(index: number): void {
  const objetivoActual = this.objetivos.at(index).value;
  const objetivoInstitucional = this.myForm.get('planDesarrolloForm2_2').get('objInstitucional').value;
  
  console.log('Objetivo institucional:', objetivoInstitucional); // Para depuración inicial

  const dialogRef = this.dialog.open(ObjControl, {
    width: '50%',
    height: '70%',
    data: {
      objetivoEspecifico: objetivoActual,
      objetivoInstitucional: objetivoInstitucional,
      estrategiasSeleccionadas: objetivoActual.estrategias || [],
      odsSeleccionados: objetivoActual.ods || []
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const currentObjetivo = this.objetivos.at(index);

      // Obtenemos los arrays actuales de estrategias y ODS
      const currentEstrategias = currentObjetivo.value.estrategias || [];
      const currentOds = currentObjetivo.value.ods || [];

      // Agregamos los nuevos elementos seleccionados al final de los arreglos
      const updatedEstrategias = [...currentEstrategias, ...result.estrategias];
      const updatedOds = [...currentOds, ...result.ods];

      // Actualizamos el objetivo con los nuevos datos acumulados
      currentObjetivo.patchValue({
        estrategias: updatedEstrategias,
        ods: updatedOds
      });

      // Console log para verificar cómo se acumulan los datos
      console.log(`Estado completo del Objetivo ${index + 1}:`, currentObjetivo.value);

    }
  });
}

openModalMarco(index: number): void {
  const marcoActual = this.marco.at(index).value;
  
  const dialogRef = this.dialog.open(ActControl, {
    width: '50%',
    height: '70%',
    data: marcoActual
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const currentMarco = this.marco.at(index);
      currentMarco.patchValue({
        actividades: result.actividades,
        responsable: result.responsable,
        indicador: result.indicador,
        1: result[1],
        2: result[2],
        3: result[3],
        4: result[4],
        financiamientoRequerido: result.financiamientoRequerido,
        observaciones: result.observaciones
      });

      console.log('Marco actualizado:', currentMarco.value);
    }
  });
}



  guardarNormas(idPlanDesarrollo: number) {
    const planesNacionales = this.planNacionalControl.value;
    const planNivelSuperiores = this.planSuperiorControl.value;
    const legal = this.marcoControl.value;
    if (planesNacionales && planesNacionales.length > 0) {
      planesNacionales.forEach((id: number) => {
        const planNacional: DeveNati = {
          idPlan: idPlanDesarrollo,
          idPlanNacional: id,
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.deveNationalService.createDevelopNatiForm(planNacional).subscribe(
          (response) => { }
        )
      });

    } else {

    }

    if (legal && legal.length > 0) {
      legal.forEach((id: number) => {
        const marcoLegal: DeveLegaForm = {
          idPlan: idPlanDesarrollo,
          idMarco: id,
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.develegaService.createDeveLegaForm(marcoLegal).subscribe(
          (response) => { }
        )
      });

    } else {

    }
    if (planNivelSuperiores && planNivelSuperiores.length > 0) {
      planNivelSuperiores.forEach((id: number) => {
        const planSuperior: DeveUppe = {
          idPlan: idPlanDesarrollo,
          idPlanNivelSuperior: id,
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.deveUppeService.createDeveUppeForm(planSuperior).subscribe(
          (response) => { }
        )
      });

    } else {

    }
    //this.deveNationalService.createDevelopNatiForm()
  }
  guardarPlanBase() {
    const DevPlan: DevelopmentPlanForms = {
      idPlanDesarrollo: 0,
      idGrupoInv: this.idGroup,
      idObjetivoInst:1,
      tipo: "c",
      estado: "e",
      alcance: this.myForm.value.planDesarrolloForm2.alcance,
      contexto: this.myForm.value.planDesarrolloForm2_1.contexto,
      objGeneral: this.myForm.value.planDesarrolloForm2_2.objGeneral,
      objEstrategico: this.myForm.value.planDesarrolloForm2_2.objEstrategico,
      usuarioCreacionUsuario: this.currentUser,
      fechaCreacionUsuario: this.currentDate,
      usuarioModificacionUsuario: null,
      fechaModificacionUsuario: null
    }
    this.developmentPlanService.create(DevPlan).subscribe(
      (response) => {
        // console.log('Respuesta del servidor:', response); // Imprimir la respuesta en la consola
        //this.idPlanDesarrollo=response;
        setTimeout(() => {
          this.router.navigateByUrl('main/crea');
        }, 8000);
        this.guardarNormas(response);
        this.guardarObj(response);
        this.guardarControl(response);
        this.actualizarEstados();

      },
      (error) => {
        console.error('Error al crear el plan de desarrollo:', error); // Manejo de errores
      }
    )
    }
  guardarObj(idPlan: number) {
    const objetivos = this.myForm.value.planDesarrolloForm3.objetivos;

    objetivos.forEach((obj: any) => {
      const objetivo: Objectives = {
        idObjetivo: 0, // Inicialmente 0, se asignará después
        //idPlanDesarrollo: idPlan,
        objetivo: obj.nombre,
        usuarioCreacion: this.currentUser,
        fechaCreacion: this.currentDate,
        usuarioModificacion: null,
        fechaModificacion: null,
      };
      this.objService.createObjectivesForm(objetivo).subscribe(
        (response) => {
          const idObjetivo = response; 
          obj.estrategias.forEach((estrategia: any) => {
            const estrategiaData: Strategies = {
              //descripcion: estrategia.descripcion,
              idEstrategia: 0,
              estrategia: estrategia.descripcion,
              
              idObjetivo: idObjetivo, // Relaciona la estrategia con el objetivo creado
              usuarioCreacion: this.currentUser,
              fechaCreacion: this.currentDate,
              usuarioModificacion: null,
              fechaModificacion: null,
            };

            // Guarda la estrategia
            this.strategieService.createStrategiesForm(estrategiaData).subscribe(
              (estrategiaResponse) => {
                console.log('Estrategia creada:', estrategiaResponse); // Maneja la respuesta aquí
              },
              (error) => {
                console.error('Error al crear la estrategia:', error); // Manejo de errores
              }
            );
          });
        },
        (error) => {
          console.error('Error al crear el objetivo:', error); // Manejo de errores
        }
      );
    });
  }
  guardarControl(idPlan: number) {
    const control = this.myForm.value.planDesarrolloForm4.actividades;

    control.forEach((obj: any) => {
      const act: ControlPanelForm = {
        idPlanDesarrollo: idPlan,
        idPanelControl: 0,
        idObjetivoEspecifico:0, 
        idResponsable:0, 
        indicadorNombre:"", 
        indicadorTipo:"",
        indicadorForma:"", 
        indicadorCondicional:"",
         indicadorAcumulativo:"",
        actividad: obj.actividad,
        meta1: obj.meta1,
        meta2: obj.meta2,
        meta3: obj.meta3,
        meta4: obj.meta4,
        financiamiento: obj.financiamiento,
        observacion: obj.observaciones,
        usuarioCreacion: this.currentUser,
        fechaCreacion: this.currentDate,
        usuarioModificacion: null,
        fechaModificacion: null
      };

      // Guarda el objetivo y espera la respuesta
      this.controlPanelService.createControlPanelForm(act).subscribe(
        (response) => {
          console.log(response, "Creado")

        });
    })
  }

  HandleSubmit() {
    if (this.myForm.valid) {
      this.guardarPlanBase();
      console.log('Objetivos:', this.myForm.value.planDesarrolloForm3.objetivos);
      console.log('Cuadro de Mando Actividades:', this.myForm.value.planDesarrolloForm4.actividades);
      this.snackBar.open('Solicitudes Enviados correctamente.', 'Cerrar', {
        duration: 3000,
      });
     
     

    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
      });
    }
  }
  actualizarEstados(){
    
    this.creationReqService.getByGroup(this.idGroup).subscribe(data=>{
      const creationReq:CreationReqForm={
         idPeticionCreacion:data.idPeticionCreacion,
         idGrupoInv:data.idGrupoInv,
         alineacionEstrategica: data.alineacionEstrategica,
          estado:"M", 
          usuarioCreacionPeticion:data.usuarioCreacionPeticion,
          fechaCreacionPeticion:data.fechaCreacionPeticion,
          usuarioModificacionPeticion:this.currentUser,
          fechaModificacionPeticion:this.currentDate
      }
      this.creationReqService.update(data.idPeticionCreacion,creationReq).subscribe(
        ()=>{
        });
    })
    this.invGroupService.getById(this.idGroup).subscribe(data=>{
      const invGroup:InvGroupForm={
        idGrupoInv:this.idGroup,
        idCoordinador:data.idCoordinador,
        nombreGrupoInv:data.nombreGrupoInv,
        estadoGrupoInv:"ppropuesta",
        acronimoGrupoinv:data.acronimoGrupoinv,
        usuarioCreacion:data.usuarioCreacion,
        fechaCreacion:data.fechaCreacion,
        usuarioModificacion:this.currentUser,
        fechaModificacion:this.currentDate

      }
      this.invGroupService.update(this.idGroup,invGroup).subscribe(
        ()=>{
        });
    })
  }
}
