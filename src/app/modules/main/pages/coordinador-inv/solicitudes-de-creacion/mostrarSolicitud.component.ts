import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InvMemberForm } from 'src/app/types/invMember.types';
import { Usuario } from 'src/app/types/usuario.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importa DomSanitizer y SafeResourceUrl
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';

@Component({
  selector: 'app-solicitud-componente',
  templateUrl: './mostrarSolicitud.component.html',
  styleUrls: ['./obtenerSolicitudes.component.scss']
})
export class MostrarSolicitud implements OnInit {
  id: number;
  idPlanDesarrollo: number;
    creationReqForm: CreationReqForm;
    invGroup: InvGroupForm;
    usuario: Usuario;
    memberUser: Usuario[] = [];
    member: InvMemberForm[];
    idSolicitud: number;
    loadingData: boolean = true;
    invGroupId: number ;
    token:string;
    pdfUrlInforme: SafeResourceUrl | undefined;
    pdfUrl: SafeResourceUrl | undefined;
    pdfUrlCV: any []=[];
    pdfUrlMemo: SafeResourceUrl | undefined;

  constructor(
    private router: Router,
    private annexesService:AnnexesService,
    private documentsService: DocumentsService,
    private sanitizer: DomSanitizer,
  ) { /*this.loadingData = true;*/ }

  ngOnInit(): void {
    const navigationState = history.state;
    this.idSolicitud=navigationState.creationReqForm.idPeticionCreacion;
    this.solicitudCreacion()
    this.token=sessionStorage.getItem('access_token');

  }

  solicitudCreacion() {
   this.loadingData = true;
    const navigationState = history.state;
    if (navigationState && navigationState.creationReqForm) {
      this.creationReqForm = navigationState.creationReqForm;
      this.invGroupId=this.creationReqForm.idGrupoInv;
      this.obtenerAnexos(this.creationReqForm.idGrupoInv);
      this.cargarMemo(this.creationReqForm.idGrupoInv);
      this.cargarInformePertinencia(this.creationReqForm.idGrupoInv);
    } else {
      this.loadingData = false;
    }
  }
  obtenerAnexos(id:number){
    this.annexesService.getByGroupType(id,'propuesta').subscribe((data)=>{
      console.log('ann',data);
      this.documentsService.getDocument(this.token, data[0].rutaAnexo, data[0].nombreAnexo)
      .subscribe({
        next: (blob) => {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(pdfBlob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); 
          this.loadingData = false;
        },
        error: (err) => {
          console.error('Error al cargar el documento:', err);
          this.loadingData = false;

        }
      });
    
    })
  }
  cargarInformePertinencia(id:number){
    this.annexesService.getByGroupType(id,'Informe_Pertinencia_Grupo').subscribe((data)=>{
      console.log('ann',data);
      this.documentsService.getDocument(this.token, data[0].rutaAnexo, data[0].nombreAnexo)
      .subscribe({
        next: (blob) => {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(pdfBlob);
          this.pdfUrlInforme = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.loadingData = false;
        },
        error: (err) => {
          console.error('Error al cargar el documento:', err);
          this.loadingData = false;
        }
      });
    
    })
  }

 


 cargarMemo(id:number){
  this.annexesService.getByGroupType(id,'memo_informe_pertinencia_GI_').subscribe((data)=>{
    console.log('ann',data);
    this.documentsService.getDocument(this.token, data[0].rutaAnexo, data[0].nombreAnexo)
    .subscribe({
      next: (blob) => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        this.pdfUrlMemo = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Marcar la URL como segura
      },
      error: (err) => {
        console.error('Error al cargar el documento:', err);
        
      }
    });
  
  })
 }



  validarGrupo(ruta: string) {
    const navigationState = history.state;
    const creationReqForm = navigationState.creationReqForm;
    sessionStorage.setItem('idGrupoSol',""+this.creationReqForm.idGrupoInv);
    // Concatenar "main/" con la variable ruta
    this.router.navigate([`main/${ruta}`], { state: { creationReqForm } });
  }
  
}
