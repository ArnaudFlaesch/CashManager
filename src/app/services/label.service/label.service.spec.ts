import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { environment } from '../../../environments/environment';
import { LabelService } from './label.service';

describe('ApiService tests', () => {
  let spectator: SpectatorHttp<LabelService>;
  const createSpectator = createHttpFactory({
    service: LabelService
  });

  const labelPath = '/label/';

  beforeEach(() => (spectator = createSpectator()));

  it('Devrait retourner deux étiquettes', () => {
    const labelData = [
      { id: 1, label: 'Courses' },
      { id: 2, label: 'Restaurant' }
    ];

    spectator.service
      .getLabels()
      .subscribe((response) => expect(response).toEqual(labelData));

    const request = spectator.expectOne(
      environment.backend_url + labelPath,
      HttpMethod.GET
    );
  });

  it('Devrait créer une étiquette', () => {
    const tabLabel = 'Impots';
    const expectedNewLabel = { id: 3, label: tabLabel };

    spectator.service
      .addLabel(tabLabel)
      .subscribe((response) => expect(response).toEqual(expectedNewLabel));

    const request = spectator.expectOne(
      environment.backend_url + labelPath + 'addLabel',
      HttpMethod.POST
    );
    request.flush(expectedNewLabel);
  });
});
