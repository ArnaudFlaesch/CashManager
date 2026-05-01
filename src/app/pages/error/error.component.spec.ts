import { TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: []
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
