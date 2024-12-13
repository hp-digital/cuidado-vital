import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenMonitoreoComponent } from './resumen-monitoreo.component';

describe('ResumenMonitoreoComponent', () => {
  let component: ResumenMonitoreoComponent;
  let fixture: ComponentFixture<ResumenMonitoreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenMonitoreoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
