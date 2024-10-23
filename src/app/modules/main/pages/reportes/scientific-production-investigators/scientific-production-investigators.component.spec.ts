import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificProductionInvestigatorsComponent } from './scientific-production-investigators.component';

describe('ScientificProductionInvestigatorsComponent', () => {
  let component: ScientificProductionInvestigatorsComponent;
  let fixture: ComponentFixture<ScientificProductionInvestigatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificProductionInvestigatorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScientificProductionInvestigatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
