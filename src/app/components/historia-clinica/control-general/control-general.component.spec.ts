import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGeneralComponent } from './control-general.component';

describe('ControlGeneralComponent', () => {
  let component: ControlGeneralComponent;
  let fixture: ComponentFixture<ControlGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
