import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorHandlerService } from './../services/error.handler.service';

import { TestBed } from '@angular/core/testing';
import { LabelListComponent } from './label-list.component';
import { LabelService } from '../services/label.service/label.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LabelListComponent', () => {
  let component: LabelListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, MatDialogModule, HttpClientTestingModule],
      providers: [ErrorHandlerService, LabelService, { provide: MatDialogRef, useValue: {} }]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabelListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
