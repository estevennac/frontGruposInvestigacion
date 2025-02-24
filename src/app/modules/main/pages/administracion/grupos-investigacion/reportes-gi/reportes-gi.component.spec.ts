import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesGIComponent } from './reportes-gi.component';

describe('ReportesGIComponent', () => {
  let component: ReportesGIComponent;
  let fixture: ComponentFixture<ReportesGIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesGIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesGIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
