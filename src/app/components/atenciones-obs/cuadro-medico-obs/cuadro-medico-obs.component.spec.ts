import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroMedicoObsComponent } from './cuadro-medico-obs.component';

describe('CuadroMedicoObsComponent', () => {
  let component: CuadroMedicoObsComponent;
  let fixture: ComponentFixture<CuadroMedicoObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroMedicoObsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroMedicoObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
