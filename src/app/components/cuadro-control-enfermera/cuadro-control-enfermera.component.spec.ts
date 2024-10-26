import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroControlEnfermeraComponent } from './cuadro-control-enfermera.component';

describe('CuadroControlEnfermeraComponent', () => {
  let component: CuadroControlEnfermeraComponent;
  let fixture: ComponentFixture<CuadroControlEnfermeraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroControlEnfermeraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroControlEnfermeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
