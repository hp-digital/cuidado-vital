import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignosAlarmasComponent } from './signos-alarmas.component';

describe('SignosAlarmasComponent', () => {
  let component: SignosAlarmasComponent;
  let fixture: ComponentFixture<SignosAlarmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignosAlarmasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignosAlarmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
