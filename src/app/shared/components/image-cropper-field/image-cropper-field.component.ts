import { Component, input, output } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-image-cropper-field',
  imports: [ImageCropperComponent],
  templateUrl: './image-cropper-field.component.html',
  styleUrls: ['./image-cropper-field.component.scss'],
})
export class ImageCropperFieldComponent {
  /** Existing image (edit mode) shown until the user picks a new file. */
  public existingImage = input<string>('');
  public aspectRatio = input<number>(1 / 1);
  public maintainAspectRatio = input<boolean>(true);
  public resizeToWidth = input<number>(480);
  public format = input<'png' | 'jpeg' | 'webp' | 'bmp' | 'ico'>('png');

  /** Emits the cropped image as a base64 data URL. */
  public cropped = output<string>();

  public imageChangedEvent: Event | null = null;
  public croppedImage = '';

  constructor(private snackbar: SnackBarService) {}

  public get isEditImage(): boolean {
    return !!this.existingImage();
  }

  public fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? '';
    this.cropped.emit(this.croppedImage);
  }

  public loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'error', 'Close');
  }
}
