import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createComponentFactory,
  createHttpFactory,
  Spectator
} from '@ngneat/spectator/jest';
import { ConfigService } from '../../../app/services/config.service/config.service';
import { ErrorHandlerService } from './../../services/error.handler.service';
import { ImportConfigModalComponent } from './import-config-modal.component';

describe('ImportConfigModalComponent', () => {
  let spectator: Spectator<ImportConfigModalComponent>;

  const createComponent = createComponentFactory({
    component: ImportConfigModalComponent,
    imports: [MatSnackBarModule],
    providers: [
      ConfigService,
      ErrorHandlerService,
      { provide: MatDialogRef, useValue: {} }
    ]
  });
  const createHttp = createHttpFactory(ConfigService);

  beforeEach(() => {
    spectator = createComponent();
    createHttp();
  });

  it('Should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });
});
