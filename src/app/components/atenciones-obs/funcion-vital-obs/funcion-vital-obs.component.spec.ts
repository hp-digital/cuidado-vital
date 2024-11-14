import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionVitalObsComponent } from './funcion-vital-obs.component';

describe('FuncionVitalObsComponent', () => {
  let component: FuncionVitalObsComponent;
  let fixture: ComponentFixture<FuncionVitalObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionVitalObsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionVitalObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
