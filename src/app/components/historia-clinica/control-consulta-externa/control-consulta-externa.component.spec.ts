import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlConsultaExternaComponent } from './control-consulta-externa.component';

describe('ControlConsultaExternaComponent', () => {
  let component: ControlConsultaExternaComponent;
  let fixture: ComponentFixture<ControlConsultaExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlConsultaExternaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlConsultaExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
