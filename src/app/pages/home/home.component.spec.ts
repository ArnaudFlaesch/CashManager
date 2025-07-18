import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { environment } from '../../../environments/environment';
import { Label } from '@model/Label';
import { AuthService } from '@services/auth.service/auth.service';
import { ConfigService } from '@services/config.service/config.service';
import { ErrorHandlerService } from '@services/error.handler.service';
import { LabelService } from '@services/label.service/label.service';
import { ExpenseService } from '@services/expense.service/expense.service';
import { ThemeService } from '@services/theme.service/theme.service';
import { DateUtilsService } from '../../utils/date.utils.service';
import { HomeComponent } from './home.component';
import { provideHttpClient } from '@angular/common/http';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

describe('HomeComponent', () => {
  const labelData = [
    {
      id: 1,
      label: 'Courses',
      userId: 1
    },
    {
      id: 2,
      label: 'Restaurant',
      userId: 1
    }
  ];
  const labelPath = '/label/';

  let component: HomeComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        LabelService,
        ErrorHandlerService,
        AuthService,
        ConfigService,
        ThemeService,
        ExpenseService,
        DateUtilsService,
        provideDateFnsAdapter(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should create component and get label list', () => {
    component.ngOnInit();
    const getLabelsRequest = httpTestingController.expectOne(environment.backend_url + labelPath);

    getLabelsRequest.flush(labelData);
    expect(component.labels()).toEqual(labelData);

    component.labelControl.setValue('New label');
    component.handleCreateLabel();
    const createLabelRequest = httpTestingController.expectOne(
      environment.backend_url + labelPath + 'addLabel'
    );

    const newLabel = { id: 2, label: 'New label' } as Label;
    createLabelRequest.flush(newLabel);
    expect(component.labels()).toEqual([...labelData, newLabel]);
  });
});
