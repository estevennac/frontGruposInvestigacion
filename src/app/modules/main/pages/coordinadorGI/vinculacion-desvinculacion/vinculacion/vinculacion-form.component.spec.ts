import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinculacionFormComponent } from './vinculacion-form.component';

describe('VinculacionFormComponent', () => {
  let component: VinculacionFormComponent;
  let fixture: ComponentFixture<VinculacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VinculacionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinculacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
