import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteBalanceComponent } from './reporte-balance.component';

describe('ReporteBalanceComponent', () => {
  let component: ReporteBalanceComponent;
  let fixture: ComponentFixture<ReporteBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
