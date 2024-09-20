import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaOpenaiComponent } from './busqueda-openai.component';

describe('BusquedaOpenaiComponent', () => {
  let component: BusquedaOpenaiComponent;
  let fixture: ComponentFixture<BusquedaOpenaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaOpenaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaOpenaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
