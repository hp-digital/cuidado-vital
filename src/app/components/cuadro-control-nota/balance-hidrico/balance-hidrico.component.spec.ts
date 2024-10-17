import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceHidricoComponent } from './balance-hidrico.component';

describe('BalanceHidricoComponent', () => {
  let component: BalanceHidricoComponent;
  let fixture: ComponentFixture<BalanceHidricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceHidricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceHidricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
