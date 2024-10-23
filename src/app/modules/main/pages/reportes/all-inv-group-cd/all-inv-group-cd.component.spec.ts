import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInvGroupCDComponent } from './all-inv-group-cd.component';

describe('AllInvGroupCDComponent', () => {
  let component: AllInvGroupCDComponent;
  let fixture: ComponentFixture<AllInvGroupCDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInvGroupCDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInvGroupCDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
