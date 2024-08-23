import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionesVitalesComponent } from './funciones-vitales.component';

describe('FuncionesVitalesComponent', () => {
  let component: FuncionesVitalesComponent;
  let fixture: ComponentFixture<FuncionesVitalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionesVitalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionesVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
