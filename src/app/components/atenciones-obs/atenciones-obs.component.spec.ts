import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionesObsComponent } from './atenciones-obs.component';

describe('AtencionesObsComponent', () => {
  let component: AtencionesObsComponent;
  let fixture: ComponentFixture<AtencionesObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtencionesObsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtencionesObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
