import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroControlesReportesComponent } from './cuadro-controles-reportes.component';

describe('CuadroControlesReportesComponent', () => {
  let component: CuadroControlesReportesComponent;
  let fixture: ComponentFixture<CuadroControlesReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroControlesReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroControlesReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
