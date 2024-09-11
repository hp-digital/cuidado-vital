import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGlucosaComponent } from './control-glucosa.component';

describe('ControlGlucosaComponent', () => {
  let component: ControlGlucosaComponent;
  let fixture: ComponentFixture<ControlGlucosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlGlucosaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGlucosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
