import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChecklistFormComponent } from './checklist-reg.component';

describe('ChecklistComponent', () => {
  let component: ChecklistFormComponent;
  let fixture: ComponentFixture<ChecklistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChecklistFormComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder], // Add FormBuilder as a provider
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.checklistForm).toBeDefined();
  });

  // Add more tests as needed for your specific requirements

  it('should call createModelChecklistForm method', () => {
    spyOn(component, 'createChecklistForm');
    component.createChecklistForm();
    expect(component.createChecklistForm).toHaveBeenCalled();
  });
});
