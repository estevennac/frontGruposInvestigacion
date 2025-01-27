import { Component, OnInit } from '@angular/core';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';
@Component({
  selector: 'app-carga-anexo',
  templateUrl: './memorando.component.html',
  styleUrls: ['./memorando.component.scss']
})
export class CargaSolComComponent implements OnInit {
  selectedFile: File | undefined;
  invGroup: InvGroupForm;
  fileName: string = '';
  fileUploaded: boolean = false;

  constructor(
    private annexesService: AnnexesService,
    private router: Router,
    private authService: AuthService,
    private documentService: DocumentsService
  ) { }
  ngOnInit(): void {
    const navigationState = history.state;
    this.invGroup = navigationState.invGroup
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
      const groupId = sessionStorage.getItem('invGroup');
      const customFileName = `Memo_Solicitud_Informe_Grupo_${groupId}.pdf`;
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
    const groupId = sessionStorage.getItem('invGroup');
    const customFileName = `Memo_Solicitud_Informe_Grupo_${groupId}.pdf`;
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
    const modifiedFile = new File([this.selectedFile], name, { type: this.selectedFile.type });
    this.selectedFile = modifiedFile;
  }


  onSubmit() {
    if (this.selectedFile) {
      const fileToUpload = this.selectedFile;
      const groupId = sessionStorage.getItem('invGroup');
      const currentUser = this.authService.getUserName();
      const currentDate = new Date();
      const token = sessionStorage.getItem('access_token');
      const sistema = 'publicaciones'
      this.documentService.saveDocument(token, fileToUpload, sistema).subscribe(response => {
        console.log(response);
        const annexesData: any = {
          idAnexo: 0,
          usuarioCreacionAnexo: currentUser,
          fechaCreacionAnexo: currentDate,
          usuarioModificacionAnexo: '',
          fechaModificacionAnexo: null,
          idGrupo: parseInt(groupId || '0'),
          nombreAnexo: response.uuid,
          rutaAnexo: response.fileName
        };
        this.annexesService.createAnnexesForm(annexesData).subscribe(
          () => {
            console.log('Archivo subido con éxito.');
            this.fileUploaded = true;
            setTimeout(() => {
              this.router.navigateByUrl('main/principal');
            }, 1000);
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
      })
    }
  }
    getFileIcon(fileType: string | undefined): string {
    if (!fileType) return ''; // Manejar el caso en que el tipo de archivo no esté definido

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
    this.router.navigate(["main/grupos-a"], { state: { creationReqForm } });
  }

}
