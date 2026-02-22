import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductFormComponent } from './form.component';
import { vi } from 'vitest';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let dialogRefMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ProductFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
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

    component.form.get('price')?.setValue(100);

    component.form.get('description')?.setValue('test');

    component.form.markAsDirty();
    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
    component.onSave();
    expect(dialogRefMock.close).toHaveBeenCalledWith(component.form.value);
  });
});
