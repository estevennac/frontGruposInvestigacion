import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcadCreaService } from 'src/app/core/http/acad-crea/acad-crea.service';
import { AcademicDomainService } from 'src/app/core/http/academic-domain/academic-domain.service';
import { AreaService } from 'src/app/core/http/area/area.service';
import { CreaAreaService } from 'src/app/core/http/crea-area/crea-area.service';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { InvMemberService } from 'src/app/core/http/inv-member/inv-member.service';
import { LineCreaService } from 'src/app/core/http/line-crea/line-crea.service';
import { LineService } from 'src/app/core/http/line/line.service';
import { SolCreaGiService } from 'src/app/core/http/sol-crea-gi/sol-crea-gi.service';
import { UserRolService } from 'src/app/core/http/userRol/userRol.service';
import { UsuarioService } from 'src/app/core/http/usuario/usuario.service';
import { InvGroupForm } from 'src/app/types/solCreaGI.types';
import { Usuario } from 'src/app/types/usuario.types';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'vex-ejecucion',
  templateUrl: './ejecucion.component.html',
  styleUrls: ['./ejecucion.component.scss']
})
export class EjecucionComponent implements OnInit {
  grupos: InvGroupForm[] = [];
  grupoForm: FormGroup;
  coordinadorGrupo: string = '';
  integrantesGrupo: string[] = [];
  nombreGrupo: string;
  usuarios: Usuario[] = [];
  dominiosAcademicos: any[] = [];
  areas: any[] = [];
  lineas: any[] = [];
  todasLasLineas: any[] = [];

  constructor(
    private solCreaGiService: SolCreaGiService,
    private acadCreaService: AcadCreaService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private userRolService: UserRolService,
    private invMemberService: InvMemberService,
    private academicDomainService: AcademicDomainService,
    private creationReqService: CreationReqService,
    private areaService: AreaService,
    private lineaService: LineService,
    private creaAreaService: CreaAreaService,
    private lineCreaService: LineCreaService,
    private datePipe: DatePipe
  ) {
    this.dominiosAcademicos = [];
    this.areas = [];
    this.lineas = [];
    this.integrantesGrupo = [];
  }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadGrupos();
    this.initializeForm();
    if (this.grupos.length > 0) {
      const primerGrupo = this.grupos[0];
      this.loadAreas(primerGrupo.idGrupoInv);
      this.loadLineas(primerGrupo.idGrupoInv);
      this.loadDominiosAcademicos(primerGrupo.idGrupoInv);
    }
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe(usuarios => {
      this.usuarios = usuarios;
      if (this.grupos.length > 0) {
        this.updateCoordinadorGrupo(this.grupos[0].idUser);
      }
    });
  }


  initializeForm(): void {
    const currentDate = this.datePipe.transform(
      new Date(),
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.coordinadorGrupo = '';
    this.grupoForm = this.fb.group({
      idGrupoInv: [''],
      idUser: [''],
      nombreGrupoInv: [''],
      estadoGrupoInv: [''],
      nombreOlGrupoInv: [''],
      acronimoGrupoinv: [''],
      usuarioCreacionUsuario: [''],
      fechaCreacionUsuario: [''],
      usuarioModificacionUsuario: [''],
      fechaModificacionUsuario: [''],
      coordinadorGrupo: ['']
    });
    this.coordinadorGrupo = '';
    this.nombreGrupo = '';
    this.dominiosAcademicos = [];
    this.areas = [];
    this.lineas = [];
    this.integrantesGrupo = [];
  }

  loadGrupos(): void {
    this.solCreaGiService.getAll().subscribe(grupos => {
      this.grupos = grupos;
      if (this.grupos.length > 0) {
        const primerGrupo = this.grupos[0];
        this.nombreGrupo = primerGrupo.nombreGrupoInv;
        this.populateForm(primerGrupo);
        this.loadGroupData(primerGrupo.idGrupoInv);
        this.loadAreas(primerGrupo.idGrupoInv);
        this.loadLineas(primerGrupo.idGrupoInv);
        this.loadDominiosAcademicos(primerGrupo.idGrupoInv);
        this.handleGrupoSelectionChange({
          target: { value: this.grupos[0].nombreGrupoInv }
        });
      }
    });
  }



  loadGroupData(idGrupoInv: number): void {
    forkJoin([
      this.usuarioService.getAll(),
      this.userRolService.getAllUsersRol(),
      this.invMemberService.getAll(),

    ]).subscribe(([usuarios, userRoles, invMembers]) => {
      if (userRoles) {
        const coordinador = usuarios.find(u => {
          for (let i = 0; i < userRoles.length; i++) {
            if (userRoles[i].idUsuario === u.id) {
              return true;
            }
          }
          return false;
        });

      }

      this.usuarios = usuarios || [];
      const usuariosDelGrupoIds = invMembers
        .filter(m => m.idGrupoInv === idGrupoInv)
        .map(m => m.idUsuario);
      const usuariosDelGrupo = this.usuarios.filter(u =>
        usuariosDelGrupoIds.includes(u.id)
      );
      this.integrantesGrupo = usuariosDelGrupo.map(u => u.nombre);
    });
  }

  loadDominiosAcademicos(grupoId: number): void {
    this.creationReqService.getAll().subscribe(creationReqs => {

      const creationReq = creationReqs.find(req => req.idGrupoInv === grupoId);

      if (creationReq) {
        this.acadCreaService.getAll().subscribe(acadCreas => {
          const acadCreasForReq = acadCreas.filter(
            acad => acad.idPeticionCreacion === creationReq.idPeticionCreacion
          );

          if (acadCreasForReq.length > 0) {
            const acadCreaIds = acadCreasForReq.map(acad => acad.idDomAcad);
            const uniqueDomainIds = Array.from(new Set(acadCreaIds));
            this.academicDomainService.getAll().subscribe(dominios => {
              this.dominiosAcademicos = dominios.filter(dominio =>
                uniqueDomainIds.includes(dominio.idDomimioAcademico)
              );
            });
          } else {
            this.dominiosAcademicos = [];
          }
        });
      } else {
        this.dominiosAcademicos = [];
      }
    });
  }

  loadAreas(grupoId: number): void {
    this.creationReqService.getAll().subscribe(creationReqs => {
      const creationReq = creationReqs.find(req => req.idGrupoInv === grupoId);

      if (creationReq) {
        this.creaAreaService.getAll().subscribe(creaAreas => {
          const creaAreaForReq = creaAreas.filter(
            ar => ar.idPeticionCreacion === creationReq.idPeticionCreacion
          );

          if (creaAreaForReq.length > 0) {
            const areaCreaIds = creaAreaForReq.map(area => area.idArea);
            const uniqueAreaIds = Array.from(new Set(areaCreaIds));
            this.areaService.getAll().subscribe(areasValor => {
              this.areas = areasValor.filter(area =>
                uniqueAreaIds.includes(area.idArea)
              );
            });
          } else {
            this.areas = [];

          }
        });
      } else {
        this.areas = [];
      }
    });
  }

  loadLineas(grupoId: number): void {
    this.creationReqService.getAll().subscribe(creationReqs => {
      const creationReq = creationReqs.find(req => req.idGrupoInv === grupoId);

      if (creationReq) {
        this.lineCreaService.getAll().subscribe(lineCreas => {
          const lineCreaForReq = lineCreas.filter(
            lc => lc.idPeticionCreacion === creationReq.idPeticionCreacion
          );
          if (lineCreaForReq.length > 0) {
            const lineCreaIds = lineCreaForReq.map(line => line.idLinea);
            const uniqueLineIds = Array.from(new Set(lineCreaIds));
            this.lineaService.getAll().subscribe(lineValor => {
              this.lineas = lineValor.filter(lin =>
                uniqueLineIds.includes(lin.idLinea)
              );
            });
          } else {
            this.lineas = [];
          }
        });
      } else {
        this.lineas = [];
      }
    });
  }

  actualizarIntegrantesGrupo(grupo: InvGroupForm): void {
    this.invMemberService.getAll().subscribe(invMembers => {
      const usuariosDelGrupoIds = invMembers
        .filter(m => m.idGrupoInv === grupo.idGrupoInv)
        .map(m => m.idUsuario);
      const usuariosDelGrupo = this.usuarios.filter(u =>
        usuariosDelGrupoIds.includes(u.id)
      );
      this.integrantesGrupo = usuariosDelGrupo.map(u => u.nombre);
    });
  }

  handleGrupoSelectionChange(event: any) {
    const selectedGrupoName = (event.target as HTMLSelectElement).value;
    const grupoSeleccionado = this.grupos.find(
      grupo => grupo.nombreGrupoInv === selectedGrupoName
    );

    if (grupoSeleccionado) {
      this.populateForm(grupoSeleccionado);
      this.updateCoordinadorGrupo(grupoSeleccionado.idUser);
      this.invMemberService.getAll().subscribe(
        invMembers => {
          const usuariosDelGrupoIds = invMembers
            .filter(m => m.idGrupoInv === grupoSeleccionado.idGrupoInv)
            .map(m => m.idUsuario);

          const usuariosDelGrupo = this.usuarios.filter(u =>
            usuariosDelGrupoIds.includes(u.id)
          );

          this.integrantesGrupo = usuariosDelGrupo.map(u => u.nombre);

          forkJoin([
            this.loadDominiosAcademicos(grupoSeleccionado.idGrupoInv),
            this.loadAreas(grupoSeleccionado.idGrupoInv),
            this.loadLineas(grupoSeleccionado.idGrupoInv)
          ]).subscribe(
            () => {
            },
            error => {
            }
          );
        },
        error => {
        }
      );

      this.updateCoordinadorGrupo(grupoSeleccionado.idUser);
    }
  }


  populateForm(grupo: InvGroupForm): void {
    this.grupoForm.patchValue(grupo);
    this.grupoForm.disable();
    this.updateCoordinadorGrupo(grupo.idUser);
  }

  updateCoordinadorGrupo(idUser: number): void {
    const coordinador = this.usuarios.find(u => u.id === idUser);
    if (coordinador) {
      this.coordinadorGrupo = coordinador.nombre 
    } else {
      this.coordinadorGrupo = '';
    }
  }

}
