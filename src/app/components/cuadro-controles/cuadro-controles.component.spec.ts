import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroControlesComponent } from './cuadro-controles.component';

describe('CuadroControlesComponent', () => {
  let component: CuadroControlesComponent;
  let fixture: ComponentFixture<CuadroControlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroControlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
