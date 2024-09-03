import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {PacienteService} from '@services/paciente.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {

  constructor(private PacienteService: PacienteService){
    
  }
  ngOnInit(): void {
    this.ObtenerConfiguracion(); 
  }

  ObtenerConfiguracion() {
    forkJoin([
      this.PacienteService.ObtenerPais(),
      this.PacienteService.ObtenerDepartamento(),
      this.PacienteService.ObtenerProvincia(),
      this.PacienteService.ObtenerDistrito()
    ]
    )
      .subscribe(
        data => {
          localStorage.setItem('Paises', JSON.stringify(data[0]));
          localStorage.setItem('Departamento', JSON.stringify(data[1]));
          localStorage.setItem('Provincia', JSON.stringify(data[2]));
          localStorage.setItem('Distrito', JSON.stringify(data[3]));
        },
        err => {
          console.log(err);
        }
      );
  }
}
