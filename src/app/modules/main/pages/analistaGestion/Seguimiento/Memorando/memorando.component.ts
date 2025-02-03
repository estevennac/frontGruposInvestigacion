import { Component, OnInit } from '@angular/core';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { InvGroupCompleteForm, InvGroupForm } from 'src/app/types/invGroup.types';
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
@Component({
  selector: 'app-carga-anexo',
  templateUrl: './memorando.component.html',
  styleUrls: ['./memorando.component.scss']
})

export class CargaSolComComponent implements OnInit {
  fileNameOriginal:string;
  selectedFile: File | undefined;
  invGroup: InvGroupCompleteForm;
  invGroupData:InvGroupForm;
  fileName: string = '';
  fileUploaded: boolean = false;
  groupId: number;
  loadingData: boolean = true;
  isLoading: boolean = false;

  constructor(
    private annexesService: AnnexesService,
    private router: Router,
    private authService: AuthService,
    private documentService: DocumentsService,
    private invGroupService: InvGroupService
  ) { }
  ngOnInit(): void {
    this.groupId = Number(sessionStorage.getItem("idSelectGroup"));
    this.getInvGroup();
  }
  getInvGroup() {
    this.invGroupService.getByIdAll(this.groupId).subscribe((invGroup: InvGroupCompleteForm) => {
      this.invGroup = invGroup;
      this.loadingData = false;
    });
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

      const customFileName = `Memo_Solicitud_Informe_Grupo_${this.groupId}.pdf`;
      this.setFileName(customFileName);
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
    this.selectedFile = event.target.files[0];
    const customFileName = `Memo_Solicitud_Informe_Grupo_${this.groupId}.pdf`;
    this.validateFileType();
    this.setFileName(customFileName);
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

  setFileName(name: string) {
    if (!this.selectedFile) {
      console.error("Error: No hay archivo seleccionado.");
      return;
    }
this.fileNameOriginal = this.selectedFile.name;
    const modifiedFile = new File([this.selectedFile], name, { type: this.selectedFile.type });
    this.selectedFile = modifiedFile;
  }


  onSubmit() {
    this.isLoading = true; // Mostrar el spinner
    if (this.selectedFile) {
      const fileToUpload = this.selectedFile;
      const currentUser = this.authService.getUserName();
      const currentDate = new Date();
      const token = sessionStorage.getItem('access_token');
      const sistema = 'GruposInv'
      this.documentService.saveDocument(token, fileToUpload, sistema).subscribe(response => {
        console.log(response);
        const annexesData: any = {
          idAnexo: 0,
          idDocumento: 1,
          usuarioCreacionAnexo: currentUser,
          fechaCreacionAnexo: currentDate,
          usuarioModificacionAnexo: '',
          fechaModificacionAnexo: null,
          idGrupo: this.groupId,
          nombreAnexo: response.fileName,
          rutaAnexo:response.uuid 
        };
        this.updateGroupStatus();
        this.annexesService.createAnnexesForm(annexesData).subscribe(
          () => {
            console.log('Archivo subido con éxito.');
            this.fileUploaded = true;
            sessionStorage.removeItem("idSelectGroup");
            setTimeout(() => {
              this.router.navigateByUrl('main/grupos-a');
              this.isLoading = false; // Ocultar el spinner
            }, 1000);
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
            alert("Error al subir el archivo")
            sessionStorage.removeItem("idSelectGroup");
            this.router.navigateByUrl('main/grupos-a');
          }
        );
      })
    }
  }
  updateGroupStatus() {
    const invGroupData=this.invGroup.invGroup;
    invGroupData.proceso='SolicitaPlanAnual';
    //invGroupData.fechaModificacion=new Date();
    //invGroupData.usuarioModificacion=this.authService.getUserName();
    this.invGroupService.update(this.groupId, invGroupData).subscribe(
      () => {
        console.log('Grupo actualizado con éxito');
      },
      (error) => {
        console.error('Error al actualizar el grupo', error);
      }
    );
  }
  getFileIcon(fileType: string | undefined): string {
    if (!fileType) return 'far fa-file'; // Ícono genérico si no hay tipo de archivo
  
    const fileIcons: { [key: string]: string } = {
      'application/pdf': 'far fa-file-pdf', // Ícono para PDF
    };
  
    return fileIcons[fileType] || 'far fa-file'; // Ícono genérico si el tipo no está en la lista
  }
  
  goBack() {
    this.router.navigate(["main/grupos-a"]);
  }
  
}
