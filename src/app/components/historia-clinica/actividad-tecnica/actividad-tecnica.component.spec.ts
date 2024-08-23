import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadTecnicaComponent } from './actividad-tecnica.component';

describe('ActividadTecnicaComponent', () => {
  let component: ActividadTecnicaComponent;
  let fixture: ComponentFixture<ActividadTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadTecnicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
