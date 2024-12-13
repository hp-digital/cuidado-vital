import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroControlObsComponent } from './cuadro-control-obs.component';

describe('CuadroControlObsComponent', () => {
  let component: CuadroControlObsComponent;
  let fixture: ComponentFixture<CuadroControlObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuadroControlObsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroControlObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
