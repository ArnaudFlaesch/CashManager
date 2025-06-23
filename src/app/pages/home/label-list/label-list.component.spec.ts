import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from '@services/error.handler.service';

import { TestBed } from '@angular/core/testing';
import { LabelListComponent } from './label-list.component';
import { LabelService } from '@services/label.service/label.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LabelListComponent', () => {
  let component: LabelListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        LabelService,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabelListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
