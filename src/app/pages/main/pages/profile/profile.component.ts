import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { take } from 'rxjs';
import { UserModel } from '@core/models';
import { UsersService } from '@core/services/users/users.service';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { ProfileFormService } from './services/profile-form.service';
import { LoaderModule } from '@core/components/loader/loader.module';

@Component({
    standalone: true,
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      ImageCropperComponent,
      LoaderModule,
    ],
    providers: [ProfileFormService]
})
export class ProfileComponent implements OnInit {
  public profileForm?: FormGroup;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public showCropper = false;

  private user?: UserModel;

  constructor(
    private userService: UsersService,
    private profileFormService: ProfileFormService,
    private snackbar: SnackBarService
  ) { }

  public get username(): FormControl {
    return this.profileForm?.get('username') as FormControl;
  }

  public get profilePhoto(): FormControl {
    return this.profileForm?.get('profile_photo') as FormControl;
  }

  public get key(): FormControl {
    return this.profileForm?.get('key') as FormControl;
  }

  ngOnInit(): void {
    this.userService.getUser().pipe(take(1)).subscribe(data => {
      this.user = data[0];
      this.profileForm = this.profileFormService.createForm(this.user);
    });
  }

  public fileChangeEvent(event: any): void {
    const isImage = event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'image/png';
    isImage ? this.imageChangedEvent = event : this.snackbar.openSnackBar('Invalid image format', 'error', 'Close');
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public imageLoaded(): void {
    this.showCropper = true;
  }

  public loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'error', 'Close');
  }

  public submit(): void {
    if (this.profileForm?.valid) {
      this.key.setValue(this.user?.key);

      if (this.croppedImage) {
        this.profilePhoto.setValue(this.croppedImage);
      }

      this.userService.updateUser(this.profileForm.value).then(() => {
        this.snackbar.openSnackBar('Profile was updated', 'success', 'Close');
      });
    }
  }
}
