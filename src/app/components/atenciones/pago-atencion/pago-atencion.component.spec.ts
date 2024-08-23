import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoAtencionComponent } from './pago-atencion.component';

describe('PagoAtencionComponent', () => {
  let component: PagoAtencionComponent;
  let fixture: ComponentFixture<PagoAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoAtencionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
