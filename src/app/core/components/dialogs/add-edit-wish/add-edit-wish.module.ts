import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditWishComponent } from './add-edit-wish.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
