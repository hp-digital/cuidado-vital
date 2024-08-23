import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterconsultaComponent } from './interconsulta.component';

describe('InterconsultaComponent', () => {
  let component: InterconsultaComponent;
  let fixture: ComponentFixture<InterconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterconsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
