import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstadoPacienteComponent } from './detalle-estado-paciente.component';

describe('DetalleEstadoPacienteComponent', () => {
  let component: DetalleEstadoPacienteComponent;
  let fixture: ComponentFixture<DetalleEstadoPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEstadoPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEstadoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
