import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDiabeticoComponent } from './reporte-diabetico.component';

describe('ReporteDiabeticoComponent', () => {
  let component: ReporteDiabeticoComponent;
  let fixture: ComponentFixture<ReporteDiabeticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDiabeticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDiabeticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
