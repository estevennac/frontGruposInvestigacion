import { Component,OnInit } from '@angular/core';
import { Annexes } from 'src/app/types/annexes.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';

import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
@Component({
  selector: 'app-carga-anexo',
  templateUrl: './memorando.component.html',
  styleUrls: ['./memorando.component.scss']
})
export class CargaSolDirComponent implements OnInit {
  selectedFile: File | undefined;
  invGroup:InvGroupForm;
  fileName: string = '';
  fileUploaded: boolean = false; 

  constructor(
    private annexesService:AnnexesService,
    private router:Router,
    private authService: AuthService,
    private invGroupService: InvGroupService,
  ) {}
  ngOnInit(): void {
    const navigationState=history.state;
    this.invGroup=navigationState.invGroup
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
      const customFileName =  `Memo_Solicitud_Informe_Dir_Grupo_${groupId}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.pdf`;
      const currentUser = this.authService.getUserName();
      const annexesData: Annexes = {
        idAnexo: 0, 
        usuarioCreacionAnexo: currentUser, 
        fechaCreacionAnexo: currentDate, 
        usuarioModificacionAnexo: '', 
        fechaModificacionAnexo: null, 
        idGrupo: parseInt(groupId || '0'),
        nombreAnexo: customFileName,
        rutaAnexo: `https://www.repositorio.espe.edu.ec/creacionGrupos/${customFileName}`
      };

      this.annexesService.createAnnexesForm(annexesData).subscribe(
        () => {
          console.log('Archivo subido con éxito.');
          this.fileUploaded = true; // Establecer la bandera a verdadero cuando el archivo se haya cargado correctamente
          setTimeout(() => {
            this.router.navigateByUrl('main/grupos-d');
          }, 2000); 
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          setTimeout(() => {
            this.router.navigateByUrl('main/grupos-d');
          }, 2000); 
        }
      );

      console.log('Archivo seleccionado:', fileToUpload);
      console.log('Nombre personalizado:', customFileName);
    }
    const currentUser = this.authService.getUserName();
    const currentDateUpdate=new Date();
    this.invGroupService.getById(this.invGroup.idGrupoInv).subscribe((data)=>{
      const invData:any={
        idGrupoInv:data.idGrupoInv,
        idCoordinador:data.idCoordinador,
        estadoGrupoInv:'sol_documentacion',
        usuarioModificacionUsuario:currentUser,
        fechaModificacionUsuario:currentDateUpdate,
      }
      this.invGroupService.update(this.invGroup.idGrupoInv,invData).subscribe(()=>{

      })
    })

      
  }    

  getFileIcon(fileType: string | undefined): string {
    if (!fileType) return ''; // Manejar el caso en que el tipo de archivo no esté definido
    
    // Convertir el tipo de archivo a minúsculas para manejar casos insensibles a mayúsculas y minúsculas
    const lowerCaseFileType = fileType.toLowerCase();
  
    // Mapear extensiones de archivo comunes a sus respectivos iconos
    const fileIcons: { [key: string]: string } = {
      'pdf': 'far fa-file-pdf', 
    };
  
    // Obtener el icono del archivo según su extensión
    const iconClass = fileIcons[lowerCaseFileType] || fileIcons['default'];
  
    return iconClass; // Retornar la clase de estilo del icono
  }
  goBack() {
    const invGroup=this.invGroup;
    this.router.navigate(["main/grupos-d"],{state:{invGroup}});
  }
  
}
