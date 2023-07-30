import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createComponentFactory,
  createHttpFactory,
  Spectator
} from '@ngneat/spectator/jest';
import { LabelService } from '../services/label.service/label.service';
import { ErrorHandlerService } from './../services/error.handler.service';

import { LabelListComponent } from './label-list.component';

describe('LabelListComponent', () => {
  let spectator: Spectator<LabelListComponent>;

  const createComponent = createComponentFactory({
    component: LabelListComponent,
    imports: [MatSnackBarModule, MatDialogModule],
    providers: [ErrorHandlerService, { provide: MatDialogRef, useValue: {} }]
  });

  const createLabelHttp = createHttpFactory(LabelService);

  beforeEach(() => {
    spectator = createComponent();
    createLabelHttp();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
