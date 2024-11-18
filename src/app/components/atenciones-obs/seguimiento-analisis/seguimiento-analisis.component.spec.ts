import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoAnalisisComponent } from './seguimiento-analisis.component';

describe('SeguimientoAnalisisComponent', () => {
  let component: SeguimientoAnalisisComponent;
  let fixture: ComponentFixture<SeguimientoAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoAnalisisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
