import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeMedicoComponent } from './informe-medico.component';

describe('InformeMedicoComponent', () => {
  let component: InformeMedicoComponent;
  let fixture: ComponentFixture<InformeMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
