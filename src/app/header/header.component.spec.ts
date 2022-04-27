import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  createHttpFactory,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { AuthService } from '../services/auth.service/auth.service';
import { ConfigService } from '../services/config.service/config.service';
import { ErrorHandlerService } from '../services/error.handler.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let configService: SpectatorHttp<ConfigService>;
  let authService: SpectatorHttp<AuthService>;

  const createComponent = createComponentFactory({
    component: HeaderComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MatSnackBarModule,
      MatDialogModule
    ],
    providers: [ErrorHandlerService, { provide: MatDialogRef, useValue: {} }],
    schemas: [NO_ERRORS_SCHEMA]
  });

  const createConfigHttp = createHttpFactory(ConfigService);
  const createAuthHttp = createHttpFactory(AuthService);

  beforeEach(() => {
    spectator = createComponent();
    configService = createConfigHttp();
    authService = createAuthHttp();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
