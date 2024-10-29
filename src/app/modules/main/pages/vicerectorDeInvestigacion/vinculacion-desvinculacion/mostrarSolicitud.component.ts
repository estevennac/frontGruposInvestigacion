import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { Usuario } from 'src/app/types/usuario.types';
import { Link as LinkForm } from 'src/app/types/link.types';
import { LinkService } from 'src/app/core/http/link/link.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-solicitud-componente',
  templateUrl: './mostrarSolicitud.component.html',
  styleUrls: ['./obtenerSolicitudes.component.scss']
})
export class VinculacionForVic implements OnInit {
  pdfUrl:  string = 'https://repositorio.espe.edu.ec/bitstream/21000/12595/1/T-ESPE-049842.pdf';
  pdfUrlSafe: SafeResourceUrl;
  link: LinkForm;
  miembroVincular: Usuario;
  invGroup: InvGroupForm;
  coordinador: Usuario;
  loadingData: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private invGroupService: InvGroupService,
    private userService: UsuarioService,
    private router: Router,
    private linkService: LinkService,
    private sanitizer: DomSanitizer
  ) { this.pdfUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl); }

  ngOnInit(): void {
    this.solicitudCreacion()
  }

  solicitudCreacion() {
    this.loadingData = true;
    const navigationState = history.state;
    if (navigationState && navigationState.link) {
      this.link = navigationState.link;
      this.obtenerGrupo(this.link.idGrupoInv)
      this.obtenerMiembro(this.link.idUser);
    } else {
      this.loadingData = false;
    }
  }
  obtenerMiembro(id: number) {
    this.userService.getById(id).subscribe(data => {
      this.miembroVincular = data;
      this.loadingData = false;

    })
  }

  obtenerGrupo(id: number) {
    this.invGroupService.getById(id).subscribe(
      (data) => {
        this.invGroup = data
        this.obtenerUsuario(data.idCoordinador)
      }
    )

  }
  //recuperar el coordinador del Grupo de Investigación
  obtenerUsuario(id: number) {
    this.userService.getById(id).subscribe(
      (data) => {
        this.coordinador = data;
      }
    )
  }

  //Recuperar el anexo

  validarSolicitud() {
    const navigationState = history.state;
    const link = navigationState.link;
    this.router.navigate(['main/acta-v'], { state: { link } });

  }
}
