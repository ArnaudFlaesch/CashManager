import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { IConfirmDialogData } from './IConfirmDialogData';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let spectator: Spectator<ConfirmModalComponent>;

  const createComponent = createComponentFactory({
    component: ConfirmModalComponent,
    providers: [
      {
        provide: MatDialogRef,
        useValue: {}
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          title: 'Titre du dialog',
          message: 'Message du dialog'
        } as IConfirmDialogData
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('Should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });
});
