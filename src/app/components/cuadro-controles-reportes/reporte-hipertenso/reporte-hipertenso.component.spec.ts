import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteHipertensoComponent } from './reporte-hipertenso.component';

describe('ReporteHipertensoComponent', () => {
  let component: ReporteHipertensoComponent;
  let fixture: ComponentFixture<ReporteHipertensoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteHipertensoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteHipertensoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
