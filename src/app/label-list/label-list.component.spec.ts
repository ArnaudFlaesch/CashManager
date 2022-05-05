import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  byText,
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { environment } from '../../environments/environment';
import { Label } from '../model/Label';
import { LabelService } from '../services/label.service/label.service';
import { ErrorHandlerService } from './../services/error.handler.service';

import { LabelListComponent } from './label-list.component';

describe('LabelListComponent', () => {
  let spectator: Spectator<LabelListComponent>;
  let labelService: SpectatorHttp<LabelService>;

  const createComponent = createComponentFactory({
    component: LabelListComponent,
    imports: [MatSnackBarModule, MatDialogModule],
    providers: [ErrorHandlerService, { provide: MatDialogRef, useValue: {} }]
  });

  const createLabelHttp = createHttpFactory(LabelService);

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('Should delete a label', () => {
    const labelData = [new Label(1, 'Courses')];
    spectator.component.labels = labelData;
    expect(spectator.component.labels.length).toEqual(1);
    spectator.component.openDeleteLabelDialog(labelData[0].id);
    spectator.component.update();
    spectator.click(byText('Valider'));
    const deleteLabelRequest = labelService.expectOne(
      `${environment.backend_url}/label/deleteLabel`,
      HttpMethod.DELETE
    );
    deleteLabelRequest.flush(null);
  });
});
