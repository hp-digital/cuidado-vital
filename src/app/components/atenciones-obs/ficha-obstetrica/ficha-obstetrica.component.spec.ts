import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaObstetricaComponent } from './ficha-obstetrica.component';

describe('FichaObstetricaComponent', () => {
  let component: FichaObstetricaComponent;
  let fixture: ComponentFixture<FichaObstetricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaObstetricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaObstetricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
