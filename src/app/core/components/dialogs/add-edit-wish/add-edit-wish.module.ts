import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditWishComponent } from './add-edit-wish.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AddEditWishFormService } from './services/add-edit-wish-form.service';

@NgModule({
  declarations: [AddEditWishComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  exports: [AddEditWishComponent],
  providers: [AddEditWishFormService]
})
export class AddEditWishModule { }
