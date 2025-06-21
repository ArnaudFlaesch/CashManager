import { TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

import { beforeEach, describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ErrorComponent', () => {
  let component: ErrorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
