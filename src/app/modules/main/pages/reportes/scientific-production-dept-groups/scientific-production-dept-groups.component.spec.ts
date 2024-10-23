import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificProductionDeptGroupsComponent } from './scientific-production-dept-groups.component';

describe('ScientificProductionDeptGroupsComponent', () => {
  let component: ScientificProductionDeptGroupsComponent;
  let fixture: ComponentFixture<ScientificProductionDeptGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificProductionDeptGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScientificProductionDeptGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
