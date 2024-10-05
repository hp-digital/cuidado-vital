import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCronicoComponent } from './reporte-cronico.component';

describe('ReporteCronicoComponent', () => {
  let component: ReporteCronicoComponent;
  let fixture: ComponentFixture<ReporteCronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCronicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
