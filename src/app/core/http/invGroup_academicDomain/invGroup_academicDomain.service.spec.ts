import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InvGroup_academicDomainService } from './invGroup_academicDomain.service';
import { InvGroup_academicDomain, AcadCreaCompleto } from 'src/app/types/invGroup_academicDomain';
import { environment } from 'src/environments/environment';

describe('InvGroup_academicDomainService', () => {
  let service: InvGroup_academicDomainService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.appApiUrl + '/acad-creas';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvGroup_academicDomainService]
    });

    service = TestBed.inject(InvGroup_academicDomainService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all AcadCrea records', () => {
    const mockAcadCrea: InvGroup_academicDomain[] = [
      {
        idGrupo: 1,
        idDomAcad: 101,
        usuarioCreacion: 'user1',
        fechaCreacion: new Date(),
        usuarioModificacion: 'user1',
        fechaModificacion: new Date()
      },
      {
        idGrupo: 2,
        idDomAcad: 102,
        usuarioCreacion: 'user2',
        fechaCreacion: new Date(),
        usuarioModificacion: 'user2',
        fechaModificacion: new Date()
      }
    ];

    service.getAll().subscribe((data: InvGroup_academicDomain[]) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockAcadCrea);
    });

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAcadCrea); // Simula la respuesta del servidor
  });

  it('should retrieve an AcadCrea by id', () => {
    const mockAcadCrea: InvGroup_academicDomain = {
      idGrupo: 1,
      idDomAcad: 101,
      usuarioCreacion: 'user1',
      fechaCreacion: new Date(),
      usuarioModificacion: 'user1',
      fechaModificacion: new Date()
    };

    service.getById(1).subscribe((data: InvGroup_academicDomain) => {
      expect(data).toEqual(mockAcadCrea);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAcadCrea);
  });

  it('should create an AcadCrea form', () => {
    const newAcadCrea: InvGroup_academicDomain = {
      idGrupo: 3,
      idDomAcad: 103,
      usuarioCreacion: 'user3',
      fechaCreacion: new Date(),
      usuarioModificacion: 'user3',
      fechaModificacion: new Date()
    };

    service.createAcadCreaForm(newAcadCrea).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAcadCrea);
    req.flush({ success: true });  // Simula la respuesta del servidor
  });

  it('should retrieve AcadCreaCompleto by req id', () => {
    const mockAcadCreaCompleto: AcadCreaCompleto = {
      creacion: {
        idPeticionCreacion: 1,
        idGrupoInv: 10,
        estado: 'Activo',
        usuarioCreacionPeticion: 'user1',
        fechaCreacionPeticion: '2023-09-01T00:00:00Z',
        usuarioModificacionPeticion: 'user1',
        fechaModificacionPeticion: '2023-09-02T00:00:00Z'
      },
      dominio: [
        {
          idDomimioAcademico: 101,
          nombreDominioAcademico: 'Ciencias',
          estado: true,
          usuarioCreacionDominio: 'admin1',
          fechaCreacionDominio: '2023-01-01T00:00:00Z',
          usuarioModificacionDominio: 'admin2',
          fechaModificacionDominio: '2023-06-01T00:00:00Z'
        }
      ]
    };

    service.getByReq(1).subscribe((data: AcadCreaCompleto) => {
      expect(data).toEqual(mockAcadCreaCompleto);
    });

    const req = httpMock.expectOne(`${apiUrl}/byreq/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAcadCreaCompleto);
  });
});
