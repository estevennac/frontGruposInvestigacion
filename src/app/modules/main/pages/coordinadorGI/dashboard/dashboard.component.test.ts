import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCoordinadorComponent } from './dashboard.component';

describe('DashboardCoordinadorComponent', () => {
  let component: DashboardCoordinadorComponent;
  let fixture: ComponentFixture<DashboardCoordinadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCoordinadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCoordinadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
