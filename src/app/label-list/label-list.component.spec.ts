import { MatSnackBarModule } from '@angular/material/snack-bar';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { createHttpFactory, SpectatorHttp } from '@ngneat/spectator/jest';
import { LabelService } from '../services/label.service/label.service';
import { ErrorHandlerService } from './../services/error.handler.service';

import { LabelListComponent } from './label-list.component';

describe('LabelListComponent', () => {
  let spectator: Spectator<LabelListComponent>;
  let labelService: SpectatorHttp<LabelService>;

  const createComponent = createComponentFactory({
    component: LabelListComponent,
    imports: [MatSnackBarModule],
    providers: [ErrorHandlerService]
  });

  const createLabelHttp = createHttpFactory(LabelService);

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
