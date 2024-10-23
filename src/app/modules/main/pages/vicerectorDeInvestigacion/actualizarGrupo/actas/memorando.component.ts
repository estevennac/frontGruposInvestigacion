import { Component,OnInit } from '@angular/core';
import { Annexes } from 'src/app/types/annexes.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Link as LinkForm } from 'src/app/types/link.types';
import { LinkService } from 'src/app/core/http/link/link.service';

@Component({
  selector: 'app-carga-anexo',
  templateUrl: './memorando.component.html',
  styleUrls: ['./memorando.component.scss']
})
export class MemoActualizacionVicComponent implements OnInit {
  selectedFile: File | undefined;
  linkForm:LinkForm;
  fileName: string = '';
  fileUploaded: boolean = false; 

  constructor(
    private annexesService:AnnexesService,
    private router:Router,
    private authService: AuthService,
    private linkService: LinkService
  ) {}
  ngOnInit(): void {
    const navigationState=history.state;
    this.linkForm=navigationState.link
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
      this.setFileName(file.name);
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
    this.setFileName(this.selectedFile.name);
    this.validateFileType();
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
    this.fileName = name;
  }

  onSubmit() {
    if (this.selectedFile) {
      const fileToUpload = this.selectedFile;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const day = ('0' + currentDate.getDate()).slice(-2);
      const hours = ('0' + currentDate.getHours()).slice(-2);
      const minutes = ('0' + currentDate.getMinutes()).slice(-2);
      const seconds = ('0' + currentDate.getSeconds()).slice(-2);
      const groupId = sessionStorage.getItem('invGroup');
      const customFileName =  `Memo_Actualizacion_Grupo${groupId}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
      const currentUser = this.authService.getUserName();
      const annexesData: Annexes = {
        idAnexo: 0, 
        usuarioCreacionAnexo: currentUser, 
        fechaCreacionAnexo: currentDate, 
        usuarioModificacionAnexo: '', 
        fechaModificacionAnexo: currentDate, 
        idGrupo: parseInt(groupId || '0'),
        nombreAnexo: customFileName,
        rutaAnexo: `https://www.repositorio.espe.edu.ec/creacionGrupos/${customFileName}`
      };

      this.annexesService.createAnnexesForm(annexesData).subscribe(
        () => {
          console.log('Archivo subido con éxito.');
          this.fileUploaded = true; // Establecer la bandera a verdadero cuando el archivo se haya cargado correctamente
          setTimeout(() => {
            this.router.navigateByUrl('main/solicitud-vin-V');
          }, 1000); 
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          setTimeout(() => {
            this.router.navigateByUrl('main/solicitud-vin-V');
          }, 1000); 
        }
      );

      console.log('Archivo seleccionado:', fileToUpload);
      console.log('Nombre personalizado:', customFileName);
    }
    const currentUser = this.authService.getUserName();
    const currentDateUpdate=new Date();
      const linkDataUpdate:any={
        idUser: this.linkForm.idUser,
        idGrupoInv: this.linkForm.idGrupoInv,
        estado:'a',
        usuarioModificacion:currentUser,
        fechaModificacion:currentDateUpdate
      }
      this.linkService.update(this.linkForm.idVinculacion,linkDataUpdate).subscribe(
        ()=>{
        })
  }    
  getFileIcon(fileType: string | undefined): string {
    if (!fileType) return ''; // Manejar el caso en que el tipo de archivo no esté definido
    
    const lowerCaseFileType = fileType.toLowerCase();
  
    const fileIcons: { [key: string]: string } = {
      'pdf': 'far fa-file-pdf'
    };
  
    const iconClass = fileIcons[lowerCaseFileType] || fileIcons['default'];
  
    return iconClass; // Retornar la clase de estilo del icono
  }
  goBack() {
    const link = this.linkForm;
    this.router.navigate(["main/solicitud-vin-V"],{state:{link}});
  }
  
}
