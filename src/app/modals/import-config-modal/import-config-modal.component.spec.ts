import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfigService } from '../../../app/services/config.service/config.service';
import { ErrorHandlerService } from './../../services/error.handler.service';
import { ImportConfigModalComponent } from './import-config-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImportConfigModalComponent', () => {
  let component: ImportConfigModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, HttpClientTestingModule],
      providers: [
        ConfigService,
        ErrorHandlerService,
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ImportConfigModalComponent);
    component = fixture.componentInstance;
  });

  it('Should create the component', () => {
    expect(component).toBeTruthy();
  });
});
