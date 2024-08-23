import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoAtencionComponent } from './motivo-atencion.component';

describe('MotivoAtencionComponent', () => {
  let component: MotivoAtencionComponent;
  let fixture: ComponentFixture<MotivoAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivoAtencionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivoAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
