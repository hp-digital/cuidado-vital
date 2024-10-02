import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoControlComponent } from './nuevo-control.component';

describe('NuevoControlComponent', () => {
  let component: NuevoControlComponent;
  let fixture: ComponentFixture<NuevoControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
