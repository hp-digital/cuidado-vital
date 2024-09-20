import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetaPacienteComponent } from './receta-paciente.component';

describe('RecetaPacienteComponent', () => {
  let component: RecetaPacienteComponent;
  let fixture: ComponentFixture<RecetaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
