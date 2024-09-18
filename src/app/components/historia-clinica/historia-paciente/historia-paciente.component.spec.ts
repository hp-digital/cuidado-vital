import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaPacienteComponent } from './historia-paciente.component';

describe('HistoriaPacienteComponent', () => {
  let component: HistoriaPacienteComponent;
  let fixture: ComponentFixture<HistoriaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
