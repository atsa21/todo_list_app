import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoaderModule } from '@core/components/loader/loader.module';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ProfileFormService } from './services/profile-form.service';

const routes: Routes = [
  {
    path:'',
    component: ProfileComponent
  }
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoaderModule,
    ImageCropperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [ProfileFormService],
})
export class ProfileModule { }
