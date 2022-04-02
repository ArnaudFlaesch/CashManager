import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let spectator: Spectator<ErrorComponent>;
  const createComponent = createComponentFactory({
    component: ErrorComponent
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });
});
