import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorHandlerService {
  constructor(private snackbar: MatSnackBar) {}

  public handleError(messageToLog: string, messageToDisplay: string): void {
    console.error(messageToLog);
    this.snackbar.open(messageToDisplay, undefined, { duration: 3000 });
  }
}
