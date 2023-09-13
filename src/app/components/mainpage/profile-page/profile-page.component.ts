import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users/users.service';
import { map } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  user!: User;
  edit: boolean = false;
  profileForm: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private snackbar: SnackBarService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.pattern(Patterns.NamePattern)]),
      profile_photo: (''),
      key: (''),
      image: new FormControl('')
    });

  }

  getUser(): void {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
      this.username.setValue(this.user.username);
      this.profile_photo.setValue(this.user.profile_photo);
      this.key.setValue(this.user.key);
    });
  }

  getControl(control: string): AbstractControl {
    return this.profileForm.get(control);
  }

  get username(){
    return this.profileForm.get('username');
  }

  get profile_photo(){
    return this.profileForm.get('profile_photo');
  }

  get key(){
    return this.profileForm.get('key');
  }

  fileChangeEvent(event: any): void {
    const isImage = event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'image/png';
    if(isImage) {
      this.imageChangedEvent = event;
    } else {
      this.snackbar.openSnackBar('Invalid image format', 'error', 'Close');
    }
  } 

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage): void {
    this.showCropper = true;
  }

  loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'error', 'Close');
  }

  submit(): void {
    if(this.profileForm.valid) {
      this.profileForm.key = this.user.key;
      if(this.croppedImage) {
        this.profile_photo.setValue(this.croppedImage);
      }
      this.userService.updateUser(this.profileForm.value).then(() => {
        this.snackbar.openSnackBar('Profile was updated', 'success', 'Close');
      });
    }
  }

}
