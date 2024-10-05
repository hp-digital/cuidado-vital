import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAdultoMayorComponent } from './reporte-adulto-mayor.component';

describe('ReporteAdultoMayorComponent', () => {
  let component: ReporteAdultoMayorComponent;
  let fixture: ComponentFixture<ReporteAdultoMayorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteAdultoMayorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteAdultoMayorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
