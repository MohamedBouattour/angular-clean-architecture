import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthorFormComponent } from './form.component';
import { vi } from 'vitest';

describe('AuthorFormComponent', () => {
  let component: AuthorFormComponent;
  let fixture: ComponentFixture<AuthorFormComponent>;
  let dialogRefMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AuthorFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.valid).toBeFalsy(); // Because fields are required and default might be empty string
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close dialog with form value on save if valid', () => {
    component.form.get('name')?.setValue('test');

    component.form.get('bio')?.setValue('test');

    component.form.get('birthDate')?.setValue(new Date());

    component.form.markAsDirty();
    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
    component.onSave();
    expect(dialogRefMock.close).toHaveBeenCalledWith(component.form.value);
  });
});
