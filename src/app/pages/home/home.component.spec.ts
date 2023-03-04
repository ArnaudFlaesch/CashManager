import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  const createComponent = createComponentFactory({
    component: HomeComponent
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('Should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component.isExpenseByMonthViewSelected()).toBe(true);
    spectator.component.selectTotalExpensesByMonthView();
    expect(spectator.component.isTotalExpensesByMonthViewSelected()).toBe(true);
  });
});
