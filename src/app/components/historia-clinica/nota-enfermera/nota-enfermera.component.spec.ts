import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaEnfermeraComponent } from './nota-enfermera.component';

describe('NotaEnfermeraComponent', () => {
  let component: NotaEnfermeraComponent;
  let fixture: ComponentFixture<NotaEnfermeraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaEnfermeraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaEnfermeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
