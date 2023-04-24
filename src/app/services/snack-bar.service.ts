import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  constructor(public _snackBar: MatSnackBar) { }

  openSnackBar(message: string, type: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: type === 'error' ? 'error-snack-bar' : 'success-snack-bar',
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      duration: 3000
    });
  }
  
}
