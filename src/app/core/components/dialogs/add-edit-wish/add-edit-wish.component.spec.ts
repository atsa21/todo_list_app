import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { environment } from 'src/environments/environment';

import { AddEditWishComponent } from './add-edit-wish.component';
import { AddEditWishFormService } from './services/add-edit-wish-form.service';

describe('AddEditWishComponent', () => {
  let component: AddEditWishComponent;
  let fixture: ComponentFixture<AddEditWishComponent>;
  let formBuilder: FormBuilder;

  const MatDialogRefMock = {
    close: () => {}
  };

  const addEditWishFormServiceMock = {
    createForm: () => {}
  };

  const editDataMock = {
    key: 'fakeKey',
    image: 'fakeUrl',
    title: 'fakeTitle',
    price: 10,
    currency: 'EUR',
    link: 'fakeLink'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditWishComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: editDataMock },
        { provide: SnackBarService, useValue: {} },
        { provide: AddEditWishFormService, useValue: addEditWishFormServiceMock},
        MatDialog
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditWishComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;

    addEditWishFormServiceMock.createForm = () => {
      return formBuilder.group({
        image: new FormControl(editDataMock.image),
        title: new FormControl(editDataMock.title),
        price: new FormControl(editDataMock.price),
        currency: new FormControl(editDataMock.currency),
        link: new FormControl(editDataMock.key),
      })
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change data to edit data onInit', () => {
    component.editData = editDataMock;
  
    component.ngOnInit();
    expect(component.dialogTitle).toBe('Edit Wish');
    expect(component.actionBtn).toBe('Save');
    expect(component.image?.value).toBe('fakeUrl');
    expect(component.title?.value).toBe('fakeTitle');
    expect(component.price?.value).toBe(10);
    expect(component.currency?.value).toBe('EUR');
    expect((component as any).key).toBe('fakeKey');
  });

  it('should not call updateWish method on addWish', () => {
    const spy = spyOn((component as any), 'updateWish');
    component.editData = null;
    component.addWish();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call updateWish method on addWish', () => {
    const spy = spyOn((component as any), 'updateWish');
    component.editData = editDataMock;
    component.addWish();
    expect(spy).toHaveBeenCalled();
  });
});
