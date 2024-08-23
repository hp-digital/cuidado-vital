import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoAtencionComponent } from './estado-atencion.component';

describe('EstadoAtencionComponent', () => {
  let component: EstadoAtencionComponent;
  let fixture: ComponentFixture<EstadoAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoAtencionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
