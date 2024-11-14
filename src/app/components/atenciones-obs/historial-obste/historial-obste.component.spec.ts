import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialObsteComponent } from './historial-obste.component';

describe('HistorialObsteComponent', () => {
  let component: HistorialObsteComponent;
  let fixture: ComponentFixture<HistorialObsteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialObsteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialObsteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
