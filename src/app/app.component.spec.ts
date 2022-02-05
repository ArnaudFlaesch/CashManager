import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterTestingModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('Should display the title', () => {
    spectator.fixture.detectChanges();
    expect(spectator.component.title).toEqual('cash-manager');
  });
});
