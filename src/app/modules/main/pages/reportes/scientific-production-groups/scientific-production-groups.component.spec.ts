import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificProductionGroupsComponent } from './scientific-production-groups.component';

describe('ScientificProductionGroupsComponent', () => {
  let component: ScientificProductionGroupsComponent;
  let fixture: ComponentFixture<ScientificProductionGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificProductionGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScientificProductionGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
