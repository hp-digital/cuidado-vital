import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteHojaMonitoreoComponent } from './reporte-hoja-monitoreo.component';

describe('ReporteHojaMonitoreoComponent', () => {
  let component: ReporteHojaMonitoreoComponent;
  let fixture: ComponentFixture<ReporteHojaMonitoreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteHojaMonitoreoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteHojaMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
