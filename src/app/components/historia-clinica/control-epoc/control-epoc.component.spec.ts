import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEpocComponent } from './control-epoc.component';

describe('ControlEpocComponent', () => {
  let component: ControlEpocComponent;
  let fixture: ComponentFixture<ControlEpocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlEpocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEpocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
