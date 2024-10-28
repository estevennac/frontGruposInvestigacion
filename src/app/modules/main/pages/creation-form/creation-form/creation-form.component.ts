import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SolCreaGiService } from 'src/app/core/http/sol-crea-gi/sol-crea-gi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { AcademicDomainService } from 'src/app/core/http/academic-domain/academic-domain.service';
import { AreaService } from 'src/app/core/http/area/area.service';
import { LineService } from 'src/app/core/http/line/line.service';
import { InvMemberService } from 'src/app/core/http/inv-member/inv-member.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { MembersGroup } from './membersGroup.component';
import { InvGroup_academicDomainService } from 'src/app/core/http/invGroup_academicDomain/invGroup_academicDomain.service';
import { InvGroup_linesService } from 'src/app/core/http/InvGroup_line/invGroup_linesService.service';
import { InvGroup_areaService } from 'src/app/core/http/invGroup_area/crea-area.service';
import { InvGroup_academicDomain } from 'src/app/types/invGroup_academicDomain';
import { InvGroup_line } from 'src/app/types/invGroup_line';
import { InvGroup_area } from 'src/app/types/invGroup_area.types';
import { InvMemberForm } from 'src/app/types/invMember.types';
import { UserRolService } from 'src/app/core/http/userRol/userRol.service';
import { UserRoles } from 'src/app/types/userRol.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Annexes } from 'src/app/types/annexes.types';
import { ChecklistService } from 'src/app/core/http/checklist/checklist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';

@Component({
  selector: 'vex-creation-form',
  templateUrl: './creation-form.component.html',
  styleUrls: ['./creation-form.component.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class CreationFormComponent implements OnInit {
  selectedUsers: any[] = [];
  selectedFiles: File[] = [];
  userIdSelect: any[] = [];
  dominiosControl = new FormControl();
  areasControl = new FormControl();
  lineasControl = new FormControl();
  isLinear = true;
  savedMessage: string;
  myForm: FormGroup;
  reqFormResponse: any;
  usuarios: any[] = [];
  dominios: any[];
  areas: any[];
  lineas: any[];
  investigadores: number[] = [1];
  invGroupExists: boolean = false;
  checklistForm: FormGroup;
  checkList: any;
  revisado: any;
  check: boolean = false;
  grupo:InvGroupForm;
  loadingData: boolean = true;
  currentUser: string;
  currentDate: any;
  currentUserId:number;

  constructor(
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private solCreaGIFormService: SolCreaGiService,
    private creationReqService: CreationReqService,
    private authService: AuthService,
    private apiInvGroupService: InvGroupService,
    private academicDomainService: AcademicDomainService,
    private areaService: AreaService,
    private lineService: LineService,
    private apiInvMemberService: InvMemberService,
    private router: Router,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private invGroup_areaService: InvGroup_areaService,
    private invGroup_academicDomainService: InvGroup_academicDomainService,
    private invGroup_linesService: InvGroup_linesService,
    private userRolService: UserRolService,
    private annexesServices: AnnexesService, private checklistService: ChecklistService,
    private documentService: DocumentsService


  ) { this.usuarios = []; }

  ngOnInit(): void {
    this.currentUser=this.authService.getUserName();
    this.currentDate = new Date();
    this.currentUserId=Number(sessionStorage.getItem("userId"));
    this.checkInvGroupInSessionStorage();
    this.areasControl.valueChanges.subscribe((selectedAreas: any[]) => {
      this.updateLineasByAreas(selectedAreas);
    });
  }
  updateLineasByAreas(selectedAreas: any[]) {
    this.lineas = []; // Limpia las líneas actuales

    if (selectedAreas.length > 0) {
      // Itera sobre cada área seleccionada y llama al servicio para obtener sus líneas
      selectedAreas.forEach((idArea) => {
        this.lineService.getLineByArea(idArea).subscribe((lineasArea: any[]) => {
          // Agrega las líneas obtenidas y evita duplicados
          this.lineas = [
            ...this.lineas,
            ...lineasArea.filter(
              (linea) => !this.lineas.some((l) => l.idLinea === linea.idLinea)
            ),
          ];
        });
      });
    }
  }
  //Verificamos si existe un grupo de investigación o se ha empezado algun proceso respecto a la creacion del mismo
  checkInvGroupInSessionStorage() {
    const invGroup = sessionStorage.getItem('invGroup');
    if (invGroup) {
      this.invGroupExists = true;
      this.cargarInfoGrupo(Number(invGroup));
      this.cargarChecklist(Number(invGroup));
    } else {
      this.invGroupExists = false;
      this.cargarFormularios(invGroup);
    }
  }
  //Cargamos los formularios respectivos si no se encuentran registros de que se ha creado un grupo de investigacion o tiene un proceso anterior
  cargarFormularios(invGroup){
     this.cargarInfoGrupo(Number(invGroup));
      this.loadDominios();
      this.loadAreas();
      //this.loadLineas();
      this.dominiosControl.patchValue(this.dominios);
      this.areasControl.patchValue(this.areas);
      this.lineasControl.patchValue(this.lineas);
      const token = sessionStorage.getItem('acces_token');
      this.loadUser(this.currentUser, token);
    this.myForm = this.builder.group({
      grupoInv1: this.builder.group({
        idUser: sessionStorage.getItem('idUser'),
        nombreGrupoInv: ['', Validators.required],
        acronimoGrupoinv: ['', Validators.required],
      }),
      grupoInv2: this.builder.group({
        dominios:this.dominiosControl,
        areas:this.areasControl,
        lineas:this.lineasControl,
      }),
      grupoInv2_1:this.builder.group({
        alineacionEstrategica:['', Validators.required]
      }),
      grupoInv3: this.builder.group({
        cvsCoordinador: new FormControl(''),
        meritosCoordinador: new FormControl(''),
        certificadosCoordinador: new FormControl(''),
        investigadores: new FormArray([
          this.crearFormGroupInvestigador(),
        ]),
        resumenGrupo: new FormControl(''),
        planDesarrolloGrupo: new FormControl(''),
      }),
      grupoInv4: this.builder.group({

      })
    });
  }

  
  get grupoInvform() {
    return this.myForm.get('grupoInv1') as FormGroup;
  }
  get grupoInv2() {
    return this.myForm.get('grupoInv2') as FormGroup;
  }
  get grupoInv2_1() {
    return this.myForm.get('grupoInv2_1') as FormGroup;
  }
  get grupoInv3() {
    return this.myForm.get('grupoInv3') as FormGroup;
  }
  get grupoInv4() {
    return this.myForm.get('grupoInv4') as FormGroup;
  }
  private crearFormGroupInvestigador() {
    return new FormGroup({
      idUsuario: new FormControl(''),
      cvsInvestigador: new FormControl(''),
      meritosInvestigador: new FormControl(''),
      certificadosInvestigador: new FormControl(''),
    });
  }
  //Cargamos la Información del Grupo si tiene un proceso Anterior
  cargarInfoGrupo(id: number){
    this.apiInvGroupService.getById(id).subscribe(data =>{
      this.grupo=data;
      this.loadingData = false;
    })
  }

  loadDominios(): void {
    this.academicDomainService.getAll().subscribe(data => {
      this.dominios = data.filter(dominio => dominio.estado === true);
    });
  }
  
  loadAreas(): void {
    this.areaService.getAll().subscribe(data => {
      this.areas = data.filter(area => area.estado === true);
    });
  }
  
  /*loadLineas(): void {
    this.lineService.getAll().subscribe(data => {
      this.lineas = data.filter(linea => linea.estado === true);
      this.loadingData = false;
    });
  }*/


  //Abrimos un modal para poder agregar investigadores, en base a usuarios que se utilizan mediante la Api de la ESPE, mediante su username
  openDialog(): void {
    const dialogRef = this.dialog.open(MembersGroup, {
      width: '60%',
      height: '90%',
      data: { usuarios: this.usuarios }
    });

    dialogRef.afterClosed().subscribe((data: { user: any, usuarioValue: any }) => {
      if (data.usuarioValue) {
        this.userIdSelect.push(data.usuarioValue);
      }
      if (data.user) {
        this.selectedUsers.push({ user: data.user, userId: data.usuarioValue }); // Agregar el usuario y establecer su valor de identificación en null
      }

    });
  }

  loadUser(user: string, token: string) {
    this.usuarioService.getUserApp(user, token).subscribe((data) => {
      //console.log("informacion api",data);
    }

    )
  }

  //borrar investigadores de la lista al agregar miembros em caso de que estos hayan sido mal descritos
  borrarInvestigador(index: number) {
    this.selectedUsers.splice(index, 1); 
  }
  agregarInvestigador() {
    (this.myForm.get('grupoInv3').get('investigadores') as FormArray).push(
      this.crearFormGroupInvestigador()
    );
    this.investigadores.push(this.investigadores.length + 1); // Agregar el nuevo índice
  }

  eliminarInvestigador() {
    const index = this.investigadores.length - 1; // Obtener el índice del último investigador
    (this.myForm.get('grupoInv3').get('investigadores') as FormArray).removeAt(index); // Eliminar el investigador en el índice
    this.investigadores.pop(); // Eliminar el último índice
  }

  // !!!REVISSAR SI SE UTLIZARA ESTOS ANEXOS 
  selectedFileByUser: { [index: number]: File } = {};
  anexos(event: Event, letter: string) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {

        if (letter === 'r') {
          const nuevoNombre = `resumen.${file.name.split('.').pop()}`;
          const archivoRenombrado = new File([file], nuevoNombre, { type: file.type });
          this.selectedFiles.push(archivoRenombrado);
        }
        else if (letter === 'c') {
          const nuevoNombre = `certificadoCategoriaDocente.${file.name.split('.').pop()}`;
          const archivoRenombrado = new File([file], nuevoNombre, { type: file.type });
          this.selectedFiles.push(archivoRenombrado);
        } else if (letter === 'm') {
          const nuevoNombre = `MeritosCientificos.${file.name.split('.').pop()}`;
          const archivoRenombrado = new File([file], nuevoNombre, { type: file.type });
          this.selectedFiles.push(archivoRenombrado);
        }
        console.log('selected files:', this.selectedFiles);

      } else {
        alert('Por favor, seleccione un archivo PDF.');
        input.value = '';
      }
    }
  }

//Para dar formato y controlar las hojas de vida de los miembros del grupo de Investigación.
  onFileSelected(event: Event, index: number, nombre: string) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        const nombreUsuario = nombre;
        const nuevoNombre = `hojaDeVida_${nombreUsuario}.${file.name.split('.').pop()}`;
        const archivoRenombrado = new File([file], nuevoNombre, { type: file.type });
        this.selectedFileByUser[index] = archivoRenombrado;
      } else {
        alert('Por favor, seleccione un archivo PDF.');
        input.value = '';
      }
    }
  }

  //Envio del Formulario
  HandleSubmit() {
    if (this.myForm.valid) {
      this.loadingData = true;
      const grupoInvData:InvGroupForm={
        idGrupoInv:1, 
        idUser:this.currentUserId, 
        nombreGrupoInv:this.myForm.value.grupoInv1.nombreGrupoInv,
        estadoGrupoInv:"inicialpp", 
        acronimoGrupoinv:this.myForm.value.grupoInv1.acronimoGrupoinv, 
        usuarioCreacion:this.currentUser, 
        fechaCreacion:this.currentDate, 
        usuarioModificacion:null, 
        fechaModificacion:null
      }     
      this.solCreaGIFormService.createInvGroup(grupoInvData).subscribe(
        (response) => {
          this.reqFormResponse = response;
          // Mostrar toast de éxito
          this.snackBar.open('Enviado con éxito', 'Cerrar', {
            duration: 2000, // Duración del toast en milisegundos
          });
          // Recargar la página después de 3 segundos
          
          setTimeout(() => {
            window.location.reload();
          }, 8000);

          /*this.savedMessage = 'Formulario guardado con éxito';
          setTimeout(() => {
            this.router.navigateByUrl('main/principal');
          }, 100);
          */
          const idGrupoCreado = this.reqFormResponse;
          const reqFormData: CreationReqForm = {
            idPeticionCreacion: null,
            idGrupoInv: idGrupoCreado,
            alineacionEstrategica: this.myForm.value.grupoInv2_1.alineacionEstrategica,
            estado: "p",
            usuarioCreacionPeticion: this.currentUser,
            fechaCreacionPeticion: this.currentDate,
            usuarioModificacionPeticion: null,
            fechaModificacionPeticion: null,
          };

          this.creationReqService.createCreationRequestForm(reqFormData).subscribe(
            (reqFormResponse) => {
              
              this.saveCurriculums(idGrupoCreado, this.currentUser, this.currentDate);
              this.saveAcademicDomain(reqFormResponse);
              this.saveArea(reqFormResponse);
              this.saveLine(reqFormResponse);
              this.saveMember(idGrupoCreado);
              this.saveAnexos(idGrupoCreado, this.currentUser, this.currentDate);
              // Guardar reqFormResponse en el localStorage
              localStorage.setItem('reqFormResponse', JSON.stringify(reqFormResponse));
            },
            (reqFormError) => {
              console.error('Error al crear el registro en CreationReqForm:', reqFormError);
            }
          );
        },
        (error) => {
          this.savedMessage = 'Error al guardar el formulario';
        }
      );
    } else {
      this.savedMessage = 'Verifica los campos del formulario';
    }

  }

  //Guardamos los dominios academicos,lineas y areas relacionadas al la solicitud de creacion y al grupo de Investigacion
  private saveAcademicDomain(id: number) {
    const dominiosSeleccionados = this.dominiosControl.value;
    if (dominiosSeleccionados && dominiosSeleccionados.length > 0) {
      dominiosSeleccionados.forEach((dominioId: number) => {
        const acadCreaForm: InvGroup_academicDomain = {
          idGrupo: id,
          idDomAcad: dominioId,
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.invGroup_academicDomainService.createAcadCreaForm(acadCreaForm).subscribe(
          (response) => {
          }
        );
      });
    } else {
    }
  }

  private saveLine(id: number) {
    const lineasSeleccionadas = this.lineasControl.value;
    if (lineasSeleccionadas && lineasSeleccionadas.length > 0) {
      lineasSeleccionadas.forEach((lineasId: number) => {
        const lineCreaForm: InvGroup_line = {
          idGrupo: id,
          idLinea: lineasId,
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.invGroup_linesService.createInvGroup_lineForm(lineCreaForm).subscribe(
          (response) => {
          }
        )
      });
    } else {
    }
  }

  private saveArea(id: number) {
    const areasSeleccionadas = this.areasControl.value;
    if (areasSeleccionadas && areasSeleccionadas.length > 0) {
      areasSeleccionadas.forEach((areasId: number) => {
        const areaForm: InvGroup_area = {
          idGrupo: id,
          idArea: areasId,
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.invGroup_areaService.createAreaCreaForm(areaForm).subscribe(
          (response) => {
          }
        )
      });
    } else {
    }
  }
 
//Guarda información de los miembros del grupo y se les asiga al rol de miembro
  private saveMember(idGrupo: number) {
    console.log(this.selectedUsers);
    if (this.userIdSelect && this.userIdSelect.length > 0) {
      this.userIdSelect.forEach((user: string) => {
        this.usuarioService.getByUserName(user).subscribe((data) => {
          const member: InvMemberForm = {
            idGrupoInv: idGrupo,
            idUsuario: data.id,
            usuarioCreacion: this.currentUser,
            fechaCreacion: this.currentDate,
            usuarioModificacion: null,
            fechaModificacion: null
          }
          this.apiInvMemberService.createInvMemberFormForm(member).subscribe(
            (response) => {
            },(error)=>{
              console.log(error);
            }
          )
          const userRol: UserRoles = {
            idUsuario: data.id,
            idRoles: 8,
            usuarioCreacion: this.currentUser,
            fechaCreacion: this.currentDate,
            usuarioModificacion: null,
            fechaModificacion: null
          }
          this.userRolService.createUserRol(userRol).subscribe((response) => {
          },
            (error) => {
              console.error('El usuario ya tiene el rol:', error);
            }
          )
        })
      })
    }
  }
  private saveCurriculums(idGrupo: number, user: string, date: Date) {
    for (let index in this.selectedFileByUser) {
      //const archivo = this.selectedFileByUser[index];
      //console.log(`Archivo para el usuario antes ${index}:`, archivo);
      if (this.selectedFileByUser.hasOwnProperty(index)) {
        const archivo = this.selectedFileByUser[index];
        console.log(`Archivo para el usuario despues ${index}:`, archivo);
        const token = sessionStorage.getItem('access_token');
        const sistema = 'publicaciones'
        this.documentService.saveDocument(token,archivo,sistema).subscribe(response=>{
          //console.log("respuesta", response);
          //console.log("sistema sent", archivo);
          const annexes: Annexes = {
            idAnexo: null,
            idGrupo: idGrupo,
            nombreAnexo: response.fileName,
            rutaAnexo: response.uuid,
            usuarioCreacionAnexo: user,
            fechaCreacionAnexo: date,
            usuarioModificacionAnexo: null,
            fechaModificacionAnexo: null
          }
          this.annexesServices.createAnnexesForm(annexes).subscribe((response) => {

          })
        }),(err)=>{
          console.log(err);
        }
        
        
      }
    }
  }

  //Cargamos Información respectiva de un  checklist de verificacion de documentos, 
  cargarChecklist(id: number) {
    this.checklistService.getByGroup(id).subscribe(data => {
      this.checkList = data;
      this.revisadoPor(data.recibidoPor);
      this.checklistForm = this.builder.group({
        peticionMemorando: [data.peticionMemorando],
        formularioGrInv: [data.formularioGrInv],
        planDevGr: [data.planDevGr],
        planEconomico: [data.planEconomico],
        hojaVida: [data.hojaVida],
        certificado: [data.certificado],
        usuarioCreacionChecklist: [data.usuarioCreacionChecklist],
        fechaCreacionChecklist: [data.fechaCreacionChecklist],
        usuarioModificacionChecklist: [null],
        fechaModificacionChecklist: [null],
        fechaChecklist: [data.fechaChecklist],
        recibidoPor: [data.recibidoPor],
        enviadoPor: [null]
      });
      this.loadingData = false;
      const requiredFields = ['peticionMemorando', 'formularioGrInv', 'planDevGr', 'planEconomico', 'hojaVida', 'certificado'];
    const allTrue = requiredFields.every(field => this.checklistForm.get(field).value === true);
    if (allTrue) {
      //this.todosTrueFunction();
    } else {
      this.check = true;
    }
    })

    
  }
  
  revisadoPor(user: string): void {
    this.usuarioService.getByUserName(user).subscribe(data => {
      this.revisado = data
    })
  }

 
  enviarAnexos(){

    const invGroup = Number(sessionStorage.getItem('invGroup'));
    const currentUser = this.authService.getUserName();
    const currentDate = new Date();
    this.creationReqService.getByGroup(invGroup).subscribe(data=>{
      const formData:any={
        idGrupoInv:invGroup,
        estado:'E'
      }
      this.creationReqService.update(data.idPeticionCreacion,formData).subscribe(response=>{
        console.log(response)
      })
    })
    this.saveAnexos(invGroup, currentUser,currentDate)
    
    
  }
  
  /*postInvestigador(data: any) {
    this.apiInvMemberService.createInvMemberFormForm(data).subscribe((item) => {
      alert("Guardado correctamente")
    }, (error) => {
      alert("Error al enviar informacion de Grupo de investigación")
    })
  }*/


  private saveAnexos(idGrupo: number, user: string, date: Date) {
    this.selectedFiles.forEach((data) => {
      const annexes: Annexes = {
        idAnexo: null,
        idGrupo: idGrupo,
        rutaAnexo: "https://docs.google.com/document/d/137T7f6j_lvQzt99db-TvlpktpWMWKS1a/edit?usp=drive_link&ouid=106867232357735510933&rtpof=true&sd=true",
        nombreAnexo: data.name,
        usuarioCreacionAnexo: user,
        fechaCreacionAnexo: date,
        usuarioModificacionAnexo: null,
        fechaModificacionAnexo: null
      }
      
      this.annexesServices.createAnnexesForm(annexes).subscribe((response) => {
        setTimeout(() => {
          this.router.navigateByUrl('main/developPlan/${idGrupo}');
        }, 100);
      })
    })
  }
 



  enlace(plan:string){
    this.router.navigateByUrl(`main/${plan}`);

  }
}

/*  postInvGropuService(data: InvGroupForm) {
    this.apiInvGroupService.createInvGroupForm(data).subscribe((item) => {
      alert("Guardado correctamente")
    }, (error) => {
      alert("Error al enviar informacion de Grupo de investigación")
    })
  }*/