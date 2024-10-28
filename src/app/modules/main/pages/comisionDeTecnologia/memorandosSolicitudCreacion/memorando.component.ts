import { Component, OnInit } from '@angular/core';
import { Annexes } from 'src/app/types/annexes.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';
@Component({
  selector: 'app-carga-anexo',
  templateUrl: './memorando.component.html',
  styleUrls: ['./memorando.component.scss']
})
export class CargaMemoComComponent implements OnInit {
  selectedFile: File | undefined;
  creationReqForm: CreationReqForm;
  fileName: string = '';
  fileUploaded: boolean = false;
  currentDate: Date = new Date();
  currentUser: string;
  groupId: number;
  token: string
  constructor(
    private annexesService: AnnexesService,
    private router: Router,
    private authService: AuthService,
    private creationReqService: CreationReqService,
    private matSnackBar: MatSnackBar,
    private documentService: DocumentsService,
    private invGroupService: InvGroupService
  ) { }
  ngOnInit(): void {
    const navigationState = history.state;
    this.creationReqForm = navigationState.creationReqForm;
    this.currentUser = this.authService.getUserName();
    this.groupId = navigationState.creationReqForm.idGrupoInv
    this.token = sessionStorage.getItem('access_token');
  }

  onDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'pdf') {
        alert('Solo se permiten archivos PDF.');
        return;
      }
      this.selectedFile = file;
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.add('drag-over');

  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('drag-over');

  }

  onFileSelected(event: any) {

    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        const year = this.currentDate.getFullYear();
        const month = ('0' + (this.currentDate.getMonth() + 1)).slice(-2);
        const day = ('0' + this.currentDate.getDate()).slice(-2);
        const hours = ('0' + this.currentDate.getHours()).slice(-2);
        const minutes = ('0' + this.currentDate.getMinutes()).slice(-2);
        const seconds = ('0' + this.currentDate.getSeconds()).slice(-2);
        const customFileName = `memo_Comite_VITT_${this.groupId}_${year}-${month}-${day}.pdf`;

        const archivoRenombrado = new File([file], customFileName, { type: file.type });
        this.selectedFile = archivoRenombrado;
      } else {
        alert('Por favor, seleccione un archivo PDF.');
        input.value = '';
      }
    }
  }

  validateFileType() {
    if (this.selectedFile) {
      const fileExtension = this.selectedFile.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'pdf') {
        alert('Solo se permiten archivos PDF.');
        this.clearFileInput();
      }
    }
  }

  clearFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  //solicitudes-t
  onSubmit() {
    if (this.selectedFile) {
      const fileToUpload = this.selectedFile;
      const sistema = 'publicaciones'
      this.documentService.saveDocument(this.token, fileToUpload, sistema).subscribe(response => {
        const annexesData: Annexes = {
          idAnexo: 0,
          usuarioCreacionAnexo: this.currentUser,
          fechaCreacionAnexo: this.currentDate,
          usuarioModificacionAnexo: '',
          fechaModificacionAnexo: null,
          idGrupo: this.groupId,
          nombreAnexo: response.fileName,
          rutaAnexo: response.uuid
        };

        this.annexesService.createAnnexesForm(annexesData).subscribe(
          (response) => {
            this.actualizarEstados();
            this.fileUploaded = true; // Establecer la bandera a verdadero cuando el archivo se haya cargado correctamente
            setTimeout(() => {
              this.matSnackBar.open('Solicitudes Enviados correctamente.', 'Cerrar', {
                duration: 3000,
              });
              this.router.navigateByUrl('main/coord2');
            }, 1000);
          })
      }),
        (error) => {
          console.error('Error al subir el archivo:', error);
        }
    }


   
  }
  rechazar() {
    if (this.selectedFile) {
      const fileToUpload = this.selectedFile;
      const sistema = 'publicaciones'
      this.documentService.saveDocument(this.token, fileToUpload, sistema).subscribe(response => {
        const annexesData: Annexes = {
          idAnexo: 0,
          usuarioCreacionAnexo: this.currentUser,
          fechaCreacionAnexo: this.currentDate,
          usuarioModificacionAnexo: '',
          fechaModificacionAnexo: null,
          idGrupo: this.groupId,
          nombreAnexo: response.fileName,
          rutaAnexo: response.uuid
        };

        this.annexesService.createAnnexesForm(annexesData).subscribe(
          (response) => {
            //this.actualizarEstados();
            this.fileUploaded = true; // Establecer la bandera a verdadero cuando el archivo se haya cargado correctamente
            setTimeout(() => {
              this.matSnackBar.open('Solicitudes Enviados correctamente.', 'Cerrar', {
                duration: 3000,
              });
              this.router.navigateByUrl('main/coord2');
            }, 1000);
          })
      }),
        (error) => {
          console.error('Error al subir el archivo:', error);
        }
    }
    const currentUser = this.authService.getUserName();
    const currentDateUpdate = new Date();
    this.creationReqService.getById(this.creationReqForm.idPeticionCreacion).subscribe((data) => {
      const creationReq: CreationReqForm = {
        idPeticionCreacion: this.creationReqForm.idPeticionCreacion,
        idGrupoInv: data.idGrupoInv,
        alineacionEstrategica: data.alineacionEstrategica,
        estado: "R",
        usuarioCreacionPeticion: data.usuarioCreacionPeticion,
        fechaCreacionPeticion: data.fechaCreacionPeticion,
        usuarioModificacionPeticion: currentUser,
        fechaModificacionPeticion: currentDateUpdate
      }
      this.creationReqService.update(this.creationReqForm.idPeticionCreacion, creationReq).subscribe(
        () => {
        })
      this.invGroupService.getById(this.creationReqForm.idGrupoInv).subscribe(data => {
        const groupActualizacion: any = {
          idGrupoInv: data.idGrupoInv,
          idUser: data.idUser,
          estado: 'Rechazado',
          usuarioModificacionUsuario: currentUser,
          fechaModificacionUsuario: currentDateUpdate
        }
        this.invGroupService.update(this.creationReqForm.idGrupoInv, groupActualizacion).subscribe(
          () => {
          })
      })


    })
  }
  actualizarEstados() {
    this.creationReqService.getById(this.creationReqForm.idPeticionCreacion).subscribe((data) => {
      const creationReq: CreationReqForm = {
        idPeticionCreacion: this.creationReqForm.idPeticionCreacion,
        idGrupoInv: data.idGrupoInv,
        alineacionEstrategica: data.alineacionEstrategica,

        estado: "A",
        usuarioCreacionPeticion: data.usuarioCreacionPeticion,
        fechaCreacionPeticion: data.fechaCreacionPeticion,
        usuarioModificacionPeticion: this.currentUser,
        fechaModificacionPeticion: this.currentDate
      }
      this.creationReqService.update(this.creationReqForm.idPeticionCreacion, creationReq).subscribe(
        () => {
        })

    })
    this.invGroupService.getById(this.creationReqForm.idGrupoInv).subscribe(data => {
      const groupActualizacion: any = {
        idGrupoInv: data.idGrupoInv,
        idUser: data.idUser,
        estado: 'Favorable',
        usuarioModificacionUsuario: this.currentUser,
        fechaModificacionUsuario: this.currentDate
      }
      this.invGroupService.update(this.creationReqForm.idGrupoInv, groupActualizacion).subscribe(
        () => {
        })
    })
  }
  getFileIcon(fileType: string | undefined): string {
    if (!fileType) return '';
    const lowerCaseFileType = fileType.toLowerCase();
    const fileIcons: { [key: string]: string } = {
      'pdf': 'far fa-file-pdf',
    };
    const iconClass = fileIcons[lowerCaseFileType] || fileIcons['default'];

    return iconClass;
  }
  goBack() {
    const navigationState = history.state;
    const creationReqForm = navigationState.creationReqForm;

    this.router.navigate(["main/solicitud-com"], { state: { creationReqForm } });
  }

}
