import { MatDialogRef } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let spectator: Spectator<ConfirmModalComponent>;

  const createComponent = createComponentFactory({
    component: ConfirmModalComponent,
    providers: [{ provide: MatDialogRef, useValue: {} }]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('Should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });
});
