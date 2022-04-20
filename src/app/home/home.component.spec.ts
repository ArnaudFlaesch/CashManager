import { LabelService } from './../services/label.service/label.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { AuthService } from './../services/auth.service/auth.service';
import { ErrorHandlerService } from './../services/error.handler.service';
import { HomeComponent } from './home.component';
import { environment } from '../../environments/environment';
import { Label } from '../model/Label';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let labelService: SpectatorHttp<LabelService>;

  const labelPath = '/label/';

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule],
    providers: [AuthService, LabelService, ErrorHandlerService],
    schemas: [NO_ERRORS_SCHEMA]
  });
  const createLabelHttp = createHttpFactory(LabelService);

  const labelData = [new Label(1, 'Courses'), new Label(2, 'Restaurant')];

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
  });

  it('Should display two labels', () => {
    const request = labelService.expectOne(
      environment.backend_url + labelPath,
      HttpMethod.GET
    );
    request.flush(labelData);
    expect(spectator.component.labels).toEqual(labelData);
    expect(spectator.component.labels.length).toEqual(2);
  });
});
