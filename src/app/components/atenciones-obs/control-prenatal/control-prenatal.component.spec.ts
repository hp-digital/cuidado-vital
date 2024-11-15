import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPrenatalComponent } from './control-prenatal.component';

describe('ControlPrenatalComponent', () => {
  let component: ControlPrenatalComponent;
  let fixture: ComponentFixture<ControlPrenatalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlPrenatalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPrenatalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
