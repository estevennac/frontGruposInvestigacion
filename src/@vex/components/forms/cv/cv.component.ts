import { Component, Input, OnInit } from '@angular/core';
import { InvMemberService } from 'src/app/core/http/inv-member/inv-member.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { InvMemberForm } from 'src/app/types/invMember.types';
import { Usuario } from 'src/app/types/usuario.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importa DomSanitizer y SafeResourceUrl
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';

@Component({
  selector: 'app-cv-component',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CvComponent implements OnInit {

  @Input() id!: number;

  invGroup: InvGroupForm;
  usuario: Usuario;
  memberUser: Usuario[] = [];
  member: InvMemberForm[];
  loadingData: boolean = true;
  invGroupId: number ;
  token:string;
  pdfUrlInforme: SafeResourceUrl | undefined;
  pdfUrl: SafeResourceUrl | undefined;
  pdfUrlCV: any []=[];
  constructor(
    private invMemberService: InvMemberService,
    private annexesService:AnnexesService,
    private documentsService: DocumentsService,
    private sanitizer: DomSanitizer,
  ) { /*this.loadingData = true;*/ }

  ngOnInit(): void {
    this.token=sessionStorage.getItem('access_token');
    this.obtenerMiembros(this.id)
  }
  
  obtenerMiembros(id: number) {
    this.invMemberService.getAllByGroupId(id).subscribe(
      (data)=>{
        this.memberUser=data;
      this.obtenerCV(id)  ;
      } 
    )
  }
pdfUrlsCV: { [key: number]: SafeResourceUrl } = {}; // Mapeo de ID del miembro a URL del PDF
obtenerCV(id: number) {
  this.memberUser.forEach((member) => {
    const id_CV = "hojaDeVida_" + member.id;
    this.annexesService.getByGroupType(id, id_CV).subscribe((data) => {
      this.documentsService
        .getDocument(this.token, data[0].rutaAnexo, data[0].nombreAnexo)
        .subscribe({
          next: (blob) => {
            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            // Asocia el URL seguro al ID del miembro
            this.pdfUrlsCV[member.id] = safeUrl;
            this.loadingData=false
          },
          error: (err) => {
            console.error("Error al cargar el documento:", err);
            this.loadingData=false
          },
        }
    );
    });
  });
}


}
