import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNotaEvolucionComponent } from './reporte-nota-evolucion.component';

describe('ReporteNotaEvolucionComponent', () => {
  let component: ReporteNotaEvolucionComponent;
  let fixture: ComponentFixture<ReporteNotaEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteNotaEvolucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteNotaEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
