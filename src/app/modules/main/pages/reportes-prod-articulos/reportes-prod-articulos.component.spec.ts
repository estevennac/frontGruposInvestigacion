import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesProdArticulosComponent } from './reportes-prod-articulos.component';

describe('ReportesProdArticulosComponent', () => {
  let component: ReportesProdArticulosComponent;
  let fixture: ComponentFixture<ReportesProdArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesProdArticulosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesProdArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
