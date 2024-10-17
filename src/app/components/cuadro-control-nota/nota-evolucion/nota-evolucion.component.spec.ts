import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaEvolucionComponent } from './nota-evolucion.component';

describe('NotaEvolucionComponent', () => {
  let component: NotaEvolucionComponent;
  let fixture: ComponentFixture<NotaEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaEvolucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
