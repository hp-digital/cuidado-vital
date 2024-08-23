import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenAuxiliarComponent } from './examen-auxiliar.component';

describe('ExamenAuxiliarComponent', () => {
  let component: ExamenAuxiliarComponent;
  let fixture: ComponentFixture<ExamenAuxiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenAuxiliarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenAuxiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
