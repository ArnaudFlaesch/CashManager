import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service/auth.service';
import { ConfigService } from '../services/config.service/config.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ThemeService } from '../services/theme.service/theme.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatMenuModule,
        MatDialogModule
      ],
      providers: [
        ConfigService,
        AuthService,
        ErrorHandlerService,
        ThemeService,
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should switch between light and dark mode', () => {
    component.toggleTheme(true);
    expect(localStorage.getItem('preferredTheme')).toEqual('dark');
    component.toggleTheme(true);
    expect(localStorage.getItem('preferredTheme')).toEqual('dark');
    component.toggleTheme(false);
    expect(localStorage.getItem('preferredTheme')).toEqual('light');
  });
});
