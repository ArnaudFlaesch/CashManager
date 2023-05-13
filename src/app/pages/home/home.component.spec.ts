import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { HomeComponent } from './home.component';
import { LabelService } from '../../services/label.service/label.service';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Label } from '../../model/Label';
import { environment } from '../../../environments/environment';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let labelService: SpectatorHttp<LabelService>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    providers: [LabelService, ErrorHandlerService],
    imports: [MatSnackBarModule]
  });
  const createLabelHttp = createHttpFactory(LabelService);

  const labelData = [new Label(1, 'Courses', 1), new Label(2, 'Restaurant', 1)];
  const labelPath = '/label/';

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
  });

  it('Should create component and get label list', () => {
    const getLabelsRequest = labelService.expectOne(
      environment.backend_url + labelPath,
      HttpMethod.GET
    );

    getLabelsRequest.flush(labelData);

    expect(spectator.component.labels).toEqual(labelData);

    spectator.component.labelControl.setValue('New label');
    spectator.component.handleCreateLabel();
    const createLabelRequest = labelService.expectOne(
      environment.backend_url + labelPath + 'addLabel',
      HttpMethod.POST
    );

    const newLabel = { id: 2, label: 'New label' } as Label;
    createLabelRequest.flush(newLabel);
    expect(spectator.component.labels).toEqual([...labelData, newLabel]);
  });
});
