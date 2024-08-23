import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicrisisComponent } from './epicrisis.component';

describe('EpicrisisComponent', () => {
  let component: EpicrisisComponent;
  let fixture: ComponentFixture<EpicrisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpicrisisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpicrisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
