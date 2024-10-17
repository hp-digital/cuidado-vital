import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroControlNotaComponent } from './cuadro-control-nota.component';

describe('CuadroControlNotaComponent', () => {
  let component: CuadroControlNotaComponent;
  let fixture: ComponentFixture<CuadroControlNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroControlNotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroControlNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
