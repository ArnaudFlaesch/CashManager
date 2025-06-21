import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../app/services/config.service/config.service';
import { ErrorHandlerService } from './../../services/error.handler.service';
import { ImportConfigModalComponent } from './import-config-modal.component';

import { beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ImportConfigModalComponent', () => {
  let component: ImportConfigModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportConfigModalComponent],
      providers: [
        ConfigService,
        ErrorHandlerService,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ImportConfigModalComponent);
    component = fixture.componentInstance;
  });

  it('Should create the component', () => {
    expect(component).toBeTruthy();
  });
});
