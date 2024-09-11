import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPresionComponent } from './control-presion.component';

describe('ControlPresionComponent', () => {
  let component: ControlPresionComponent;
  let fixture: ComponentFixture<ControlPresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPresionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
