import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SolCreaGiService } from 'src/app/core/http/sol-crea-gi/sol-crea-gi.service';
import { Router } from '@angular/router';
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
import { Usuario } from 'src/app/types/usuario.types';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeleccionRolDialogComponent } from '../SeleccionRolDialogComponent';
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
  documentosCargados = {};
  selectedUsersExterns: any[] = [];
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
  investigadoresExterns: number[] = [1];
  invGroupExists: boolean = false;
  checklistForm: FormGroup;
  checkList: any;
  revisado: any;
  check: boolean = false;
  grupo: InvGroupForm;
  loadingData: boolean = true;
  currentUser: string;
  currentDate: any;
  currentUserId: number;
  isSaved: boolean = false;
  public isLoading: boolean = true; // Inicializar como true para que el spinner aparezca al inicio
  idGrupo: number;
  pdfUrl: SafeResourceUrl | undefined;
  CvNameOriginal:string;
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
    private documentService: DocumentsService,
        private sanitizer: DomSanitizer,
    
  ) { this.usuarios = []; }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();
    this.currentDate = new Date();
    this.currentUserId = Number(sessionStorage.getItem("userId"));
    this.idGrupo = Number(sessionStorage.getItem("invGroup"));
    this.checkInvGroupInSessionStorage();
    this.areasControl.valueChanges.subscribe((selectedAreas: any[]) => {
      this.updateLineasByAreas(selectedAreas);
    });
    this.dominiosControl.valueChanges.subscribe((selectedDominios: any[])=>{
this.updateAreasByDominios(selectedDominios);
    })
  }

  updateAreasByDominios(selectedDominios: any[]) {
    this.areas = []; // Limpia las areas actuales
    if (selectedDominios.length > 0) {
      selectedDominios.forEach((idDomimioAcademico) => {
        this.areaService.getAreasByDominio(idDomimioAcademico).subscribe((areasDominio: any[]) => {
          this.areas = [
            ...this.areas,
            ...areasDominio.filter(
              (area) => !this.areas.some((a) => a.idArea === area.idArea)
            ),
          ];
        });
      });
    }
  }
  updateLineasByAreas(selectedAreas: any[]) {
    this.lineas = []; // Limpia las líneas actuales
    if (selectedAreas.length > 0) {
      selectedAreas.forEach((idArea) => {
        this.lineService.getLineByArea(idArea).subscribe((lineasArea: any[]) => {
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
    } else {
      this.invGroupExists = false;
      this.cargarFormularios(invGroup);
      this.loadCoordinador();
    }
  }
  userCoordinador: Usuario;
  loadCoordinador() {
    this.usuarioService.getByUserName(this.currentUser).subscribe((data: Usuario) => {
      this.userCoordinador = data;
    }, error => {
    });
  }
  cargarFormularios(invGroup) {
    this.cargarInfoGrupo(Number(invGroup));
    this.loadDominios();
    this.loadAreas();
    this.dominiosControl.patchValue(this.dominios);
    this.areasControl.patchValue(this.areas);
    this.lineasControl.patchValue(this.lineas);
    const token = sessionStorage.getItem('acces_token');
    this.myForm = this.builder.group({
      grupoInv1: this.builder.group({
        idUser: sessionStorage.getItem('idUser'),
        nombreGrupoInv: ['', Validators.required],
        acronimoGrupoinv: ['', Validators.required],
      }),
      grupoInv2: this.builder.group({
        dominios: this.dominiosControl,
        areas: this.areasControl,
        lineas: this.lineasControl,
      }),
      /*grupoInv2_1: this.builder.group({
        alineacionEstrategica: ['', Validators.required]
      }),*/
      grupoInv3: this.builder.group({
        cvsCoordinador: new FormControl(''),
        meritosCoordinador: new FormControl(''),
        certificadosCoordinador: new FormControl(''),
        investigadores: new FormArray([
          this.crearFormGroupInvestigador(),
        ]),
        investigadoresExterns: new FormArray([
          this.crearFormGroupInvestigadorExtern(),
        ]),
        resumenGrupo: new FormControl(''),
        planDesarrolloGrupo: new FormControl(''),
      }),
      grupoInv4: this.builder.group({

      }),
      grupoInv5: this.builder.group({

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
  get grupoInv5() {
    return this.myForm.get('grupoInv5') as FormGroup;
  }
  private crearFormGroupInvestigador() {
    return new FormGroup({
      idUsuario: new FormControl(''),
      cvsInvestigador: new FormControl(''),
      meritosInvestigador: new FormControl(''),
      certificadosInvestigador: new FormControl(''),
    });
  }

  private crearFormGroupInvestigadorExtern() {
    return new FormGroup({
      idUsuario: new FormControl(''),
      cvsInvestigador: new FormControl(''),
      meritosInvestigador: new FormControl(''),
      certificadosInvestigador: new FormControl(''),
    });
  }

  cargarInfoGrupo(id: number) {
    this.apiInvGroupService.getById(id).subscribe(data => {
      this.grupo = data;
      this.loadingData = false;
      if(this.grupo.proceso==='SolicitaPlanAnual'){
this.loadMemo(id);
      }
    })
  }
  token:string;

loadMemo(id:number){
  this.token=sessionStorage.getItem('access_token');
this.annexesServices.getByGroupType(id,'emo_Sol').subscribe((data)=>{
  console.log('data',data);
  this.documentService.getDocument(this.token, data[0].rutaAnexo, data[0].nombreAnexo).subscribe({
    next: (blob) => {
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Marcar la URL como segura
      this.loadingData = false;
    },
    error: (err) => {
      console.error('Error al cargar el documento:', err);
      this.loadingData = false;
    }
  })
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

  openDialog(): void {
    const dialogRef = this.dialog.open(MembersGroup, {
      width: '60%',
      height: '90%',
      data: { usuarios: this.usuarios }
    });

    dialogRef.componentInstance.usuarioExternoCreado.subscribe((usuarioCreado: Usuario) => {
      const dialogRefRol = this.dialog.open(SeleccionRolDialogComponent, {
        width: '30%',
      });
    
      dialogRefRol.afterClosed().subscribe((rolSeleccionado: string) => {
        dialogRef.close();
        if (rolSeleccionado) {
          usuarioCreado.rol = rolSeleccionado; // Agregar el rol seleccionado al usuario
          this.selectedUsersExterns.push(usuarioCreado);
    
          this.snackBar.open(
            `Investigador agregado exitosamente como ${rolSeleccionado}`,
            'Cerrar',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        }
      });
    });
    

    dialogRef.afterClosed().subscribe((data: { user: any, usuarioValue: any }) => {
      if (data?.usuarioValue) {
        const idUsuarioSeleccionado = data.usuarioValue;
        if (idUsuarioSeleccionado === this.currentUser) {
          this.snackBar.open('No puedes agregarte a ti mismo', 'Cerrar', { duration: 3000 });
          return;
        }
  
        const usuarioYaExiste = this.selectedUsers.some(user => user.userId === idUsuarioSeleccionado);
        if (usuarioYaExiste) {
          this.snackBar.open('El usuario ya ha sido agregado', 'Cerrar', { duration: 3000 });
          return;
        }
  
        // **Abrir diálogo para seleccionar el rol antes de agregar el usuario**
        const dialogRolRef = this.dialog.open(SeleccionRolDialogComponent, {
          width: '300px',
          data: { user: data.user }
        });
  
        dialogRolRef.afterClosed().subscribe(rolSeleccionado => {
          if (rolSeleccionado) {
            this.selectedUsers.push({ 
              user: data.user, 
              userId: idUsuarioSeleccionado, 
              rol: rolSeleccionado  // Almacenar el rol junto con el usuario
            });
  
            this.snackBar.open(`Usuario agregado como ${rolSeleccionado}`, 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
    console.log(this.selectedUsers);
    if (this.selectedUsers && this.selectedUsers.length > 0) {
      console.log(this.selectedUsers[0].userId)
    }
    this.selectedUsers.forEach((user:any) => {
      console.log("recorre");
      console.log(user.userId);
      //console.log(user.rol);
    });
    console.log(this.userIdSelect);
  }

  borrarInvestigador(index: number) {
    this.selectedUsers.splice(index, 1);
    this.investigadores.splice(index, 1);
    this.userIdSelect.splice(index, 1);
    delete this.selectedFileByUser[index];
  }
  borrarInvestigadorExtern(index: number) {
    this.selectedUsersExterns.splice(index, 1);
    this.investigadoresExterns.splice(index, 1);
    this.userIdSelect.splice(index, 1);
    delete this.selectedFileByUserExtern[index];
  }
  agregarInvestigador() {
    (this.myForm.get('grupoInv3').get('investigadores') as FormArray).push(
      this.crearFormGroupInvestigador()
    );
    this.investigadores.push(this.investigadores.length + 1);
  
  }
  agregarInvestigadorExtern() {
    (this.myForm.get('grupoInv3').get('investigadoresExterns') as FormArray).push(
      this.crearFormGroupInvestigadorExtern()
    );
    this.investigadoresExterns.push(this.investigadoresExterns.length + 1);
  }

  eliminarInvestigadorExtern() {
    const index = this.investigadoresExterns.length - 1; // Obtener el índice del último investigador
    (this.myForm.get('grupoInv3').get('investigadoresExterns') as FormArray).removeAt(index); // Eliminar el investigador en el índice
    this.investigadoresExterns.pop(); // Eliminar el último índice
    delete this.selectedFileByUserExtern[index];

  }
  selectedFileByUser: { [index: number]: File } = {};
  selectedFileByUserExtern: { [index: number]: File } = {};

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

  onFileSelected(event: Event, index: number, userId: number) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input?.files?.length) {
      this.documentosCargados[userId] = true;
    } else {
      this.documentosCargados[userId] = false;
    }
    this.verificarDocumentosCargados();
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        const nombreUsuario = userId;
        const nuevoNombre = `hojaDeVida_${nombreUsuario}.${file.name.split('.').pop()}`;
        const archivoRenombrado = new File([file], nuevoNombre, { type: file.type });
        this.selectedFileByUser[index] = archivoRenombrado;
        console.log(archivoRenombrado);
      } else {
        alert('Por favor, seleccione un archivo PDF.');
        input.value = '';
      }
    }
  }
  documentosCompletosCargados = false;
selectedImage:File|undefined;
  
  verificarDocumentosCargados(): void {
    const usuariosInternosCompletos = this.selectedUsers.every(user => this.documentosCargados[user.user.idBd]);
    const usuariosExternosCompletos = this.selectedUsersExterns.every(user => this.documentosCargados[user.id]);
    this.documentosCompletosCargados = usuariosInternosCompletos && usuariosExternosCompletos;
  }

  onFileSelectedExtern(event: Event, index: number, userId: number) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input?.files?.length) {
      this.documentosCargados[userId] = true;
    } else {
      this.documentosCargados[userId] = false;
    }
    this.verificarDocumentosCargados();
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        const nombreUsuario = userId;
        const nuevoNombre = `hojaDeVida_${nombreUsuario}.${file.name.split('.').pop()}`;
        const archivoRenombrado = new File([file], nuevoNombre, { type: file.type });
        this.selectedFileByUserExtern[index] = archivoRenombrado;
        console.log(archivoRenombrado);
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
      const partes = this.userCoordinador.departamento.split(" - ");
      const departamento = partes[1].trim();
      const grupoInvData: InvGroupForm = {
        idGrupoInv: null,
        idCoordinador: this.currentUserId,
        nombreGrupoInv: this.myForm.value.grupoInv1.nombreGrupoInv,
        estadoGrupoInv: "inicialpp",
        acronimoGrupoinv: this.myForm.value.grupoInv1.acronimoGrupoinv,
        departamento: departamento,
        proceso:"1",
        usuarioCreacion: this.currentUser,
        fechaCreacion: this.currentDate,
        usuarioModificacion: null,
        fechaModificacion: null
      }
      console.log("datos antes de enviar", grupoInvData)
      this.solCreaGIFormService.createInvGroup(grupoInvData).subscribe(
        (response) => {
          this.reqFormResponse = response;
          const idGrupoCreado = this.reqFormResponse;
          this.saveCurriculums(idGrupoCreado, this.currentUser, this.currentDate); 
              this.saveAcademicDomain(idGrupoCreado);
              this.saveArea(idGrupoCreado);
              this.saveLine(idGrupoCreado);
              this.saveMember(idGrupoCreado);
              
              setTimeout(() => {
                this.router.navigateByUrl('main/principal');
                this.loadingData = false;
              }, 4000);

        /*   const reqFormData: CreationReqForm = {
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
              setTimeout(() => {
                window.location.reload();
              }, 8000);
            },
            (reqFormError) => {
              console.error('Error al crear el registro en CreationReqForm:', reqFormError);
            }
          );*/
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
    if (this.selectedUsers && this.selectedUsers.length > 0) {
      this.selectedUsers.forEach((user:any) => {
        console.log(this.selectedUsers);
          const member: InvMemberForm = {
            idGrupoInv: idGrupo,
            idUsuario: user.user.idBd,
            estado: true,
            tipo: user.rol+"_I",
            usuarioCreacion: this.currentUser,
            fechaCreacion: this.currentDate,
            usuarioModificacion: null,
            fechaModificacion: null
          }
          this.apiInvMemberService.createInvMemberFormForm(member).subscribe(
            (response) => {
              console.log(response );
            }, (error) => {
            }
          )
          const userRol: UserRoles = {
            idUsuario: user.user.idBd,
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
    }else{
      console.log('error no se guardo nada')
    }


    if (this.selectedUsersExterns && this.selectedUsersExterns.length > 0) {
      this.selectedUsersExterns.forEach((user: { id: number,rol: string }) => {
        const member: InvMemberForm = {
          idGrupoInv: idGrupo,
          idUsuario: user.id,
          estado: true,
          tipo: user.rol+'_E',
          usuarioCreacion: this.currentUser,
          fechaCreacion: this.currentDate,
          usuarioModificacion: null,
          fechaModificacion: null
        }
        this.apiInvMemberService.createInvMemberFormForm(member).subscribe(
          (response) => {
            console.log(response);
          }, (error) => {
            console.log(error);
          }
        )
        const userRol: UserRoles = {
          idUsuario: user.id,
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
    }
    this.snackBar.open('Enviado con éxito', 'Cerrar', {
      duration: 4000, // Duración del toast en milisegundos
    });
  }
  private saveCurriculums(idGrupo: number, user: string, date: Date) {
   
    const sistema = 'GruposInv'
    const token = sessionStorage.getItem('access_token');

    const cv=this.selectedCv;
    const img=this.selectedImg;
    this.documentService.saveDocument(token, img, sistema).subscribe(response => {
      const annexes: Annexes = {
        idAnexo: null,
        idDocumento:3,
        idGrupo: idGrupo,
        nombreAnexo: response.fileName,
        rutaAnexo: response.uuid,
        usuarioCreacionAnexo: user,
        fechaCreacionAnexo: date,
        usuarioModificacionAnexo: null,
        fechaModificacionAnexo: null
      }
      console.log("guardando LOGO")

      this.annexesServices.createAnnexesForm(annexes).subscribe((response) => {
console.log(response);
      })
    }),(error)=>{
      console.log(error);
    }

    this.documentService.saveDocument(token, cv, sistema).subscribe(response => {
      const annexes: Annexes = {
        idAnexo: null,
        idDocumento:2,
        idGrupo: idGrupo,
        nombreAnexo: response.fileName,
        rutaAnexo: response.uuid,
        usuarioCreacionAnexo: user,
        fechaCreacionAnexo: date,
        usuarioModificacionAnexo: null,
        fechaModificacionAnexo: null
      }
      console.log("guardando CV COORDINADOR")
      this.annexesServices.createAnnexesForm(annexes).subscribe((response) => {

      })
    }),(error)=>{
      console.log(error);
    }
    for (let index in this.selectedFileByUser) {
      if (this.selectedFileByUser.hasOwnProperty(index)) {
        const archivo = this.selectedFileByUser[index];
        console.log(`Archivo para el usuario despues ${index}:`, archivo);
        this.documentService.saveDocument(token, archivo, sistema).subscribe(response => {
          const annexes: Annexes = {
            idAnexo: null,
            idDocumento:2,
            idGrupo: idGrupo,
            nombreAnexo: response.fileName,
            rutaAnexo: response.uuid,
            usuarioCreacionAnexo: user,
            fechaCreacionAnexo: date,
            usuarioModificacionAnexo: null,
            fechaModificacionAnexo: null
          }
          console.log("guardando CV",archivo)

          this.annexesServices.createAnnexesForm(annexes).subscribe((response) => {

          })
        }), (err) => {
          console.log(err);
        }


      }
    }

    for (let index in this.selectedFileByUserExtern) {
      if (this.selectedFileByUserExtern.hasOwnProperty(index)) {
        const archivo = this.selectedFileByUserExtern[index];
        console.log(`Archivo para el usuario despues ${index}:`, archivo);       
        this.documentService.saveDocument(token, archivo, sistema).subscribe(response => {
          const annexes: Annexes = {
            idAnexo: null,
            idDocumento:1,
            idGrupo: idGrupo,
            nombreAnexo: response.fileName,
            rutaAnexo: response.uuid,
            usuarioCreacionAnexo: user,
            fechaCreacionAnexo: date,
            usuarioModificacionAnexo: null,
            fechaModificacionAnexo: null
          }          
          console.log("guardando CV",archivo)


          this.annexesServices.createAnnexesForm(annexes).subscribe((response) => {

          })
        }), (err) => {
          console.log(err);
        }


      }
    }
    

  }
  revisadoPor(user: string): void {
    this.usuarioService.getByUserName(user).subscribe(data => {
      this.revisado = data
    })
  }

  enlace(plan: string) {
    this.router.navigateByUrl(`main/${plan}`);

  }
  selectedCv: File | undefined;
  selectedImg: File | undefined;
filePreview: string | null = null;
fileIcon: string = 'far fa-file'; // Ícono predeterminado
isImageFile: boolean = false;
imageNameOriginal: string = '';


  //ANEXOS
  onDrop(event: any, t: string) {
    event.preventDefault();
    
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    
    if (t === 'h') {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'pdf') {
        alert('Solo se permiten archivos PDF.');
        return;
      }
      this.selectedCv = file;
      const customFileName = `Hoja_de_Vida_Coordinador${this.currentUserId}.pdf`;
      this.setFileName(customFileName);
    } else if (t === 'i') {
      this.processImageFile(file);
    }
  }
  
  onImgSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processImageFile(file);
    }
  }
  
  processImageFile(file: File) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, SVG).');
      this.clearImageInput();
      return;
    }
  
    this.isImageFile = true;
    this.selectedImg = file;
    this.imageNameOriginal = file.name;
    
    const customFileName = `imagen_GI_${this.currentUserId}.png`;
    const renamedFile = new File([file], customFileName, { type: file.type });
    this.selectedImg = renamedFile;
    
    this.previewImage(file);
  }
  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  clearImageInput() {
    this.selectedImg = undefined;
    this.imageNameOriginal = '';
    this.filePreview = null;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
    
   onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.add('drag-over');

  }
  fileNameOriginal:string;
  setFileName(name: string) {
    if (!this.selectedCv) {
      console.error("Error: No hay archivo seleccionado.");
      return;
    }
this.CvNameOriginal = this.selectedCv.name;
    const modifiedFile = new File([this.selectedCv], name, { type: this.selectedCv.type });
    this.selectedCv = modifiedFile;
  }
  setImageName(name: string) {
    if (!this.selectedImg) {
      console.error("Error: No hay archivo seleccionado.");
      return;
    }
this.imageNameOriginal = this.selectedImg.name;
    const modifiedFile = new File([this.selectedImg], name, { type: this.selectedImg.type });
    this.selectedImg = modifiedFile;
  }

  onCVCoordSelected(event: any) {
    this.selectedCv = event.target.files[0];
    const customFileName = `Hoja_de_Vida_Coordinador${this.currentUserId}.pdf`;
    this.validateFileType();
    this.setFileName(customFileName);
  }


  validateFileType() {
    if (this.selectedCv) {
      const fileExtension = this.selectedCv.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'pdf') {
        alert('Solo se permiten archivos PDF.');
        this.clearFileInput();
      }
    }
  }

  validateImageType() {
    if (this.selectedImg) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
        const fileExtension = this.selectedImg.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            alert('Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, SVG).');
            this.clearImageInput();
        }
    }
}

  clearFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  getFileIcon(fileType: string | undefined): string {
    if (!fileType) return 'far fa-file'; // Ícono genérico si no hay tipo de archivo
    const fileIcons: { [key: string]: string } = {
      'application/pdf': 'far fa-file-pdf', // Ícono para PDF
      'image/png': 'far fa-file-image',
      'image/jpeg': 'far fa-file-image',
      'image/jpg': 'far fa-file-image',
      'image/gif': 'far fa-file-image',
      'image/bmp': 'far fa-file-image',
      'image/webp': 'far fa-file-image',
      'image/tiff': 'far fa-file-image',
      'image/svg+xml': 'far fa-file-image',
    };
    return fileIcons[fileType] || 'far fa-file';
  }
}
