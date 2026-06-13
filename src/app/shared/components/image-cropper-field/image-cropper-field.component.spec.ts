import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';

import { ImageCropperFieldComponent } from './image-cropper-field.component';

describe('ImageCropperFieldComponent', () => {
  let component: ImageCropperFieldComponent;
  let fixture: ComponentFixture<ImageCropperFieldComponent>;

  const snackBarServiceMock = {
    openSnackBar: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCropperFieldComponent],
      providers: [
        { provide: SnackBarService, useValue: snackBarServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCropperFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the cropped base64 image', () => {
    const spy = spyOn(component.cropped, 'emit');

    component.imageCropped({ base64: 'data:image/png;base64,abc' } as any);

    expect(component.croppedImage).toBe('data:image/png;base64,abc');
    expect(spy).toHaveBeenCalledWith('data:image/png;base64,abc');
  });

  it('should report edit mode when an existing image is provided', () => {
    fixture.componentRef.setInput('existingImage', 'fakeUrl');
    expect(component.isEditImage).toBeTrue();
  });
});
