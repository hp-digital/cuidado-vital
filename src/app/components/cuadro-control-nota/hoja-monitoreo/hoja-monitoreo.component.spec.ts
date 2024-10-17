import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaMonitoreoComponent } from './hoja-monitoreo.component';

describe('HojaMonitoreoComponent', () => {
  let component: HojaMonitoreoComponent;
  let fixture: ComponentFixture<HojaMonitoreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HojaMonitoreoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HojaMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
