import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {

  dataFormGroup: FormGroup;
  verSpinner:boolean = false;

  constructor(
    private pacienteService:PacienteService
  ){
    this.dataFormGroup = new FormGroup({
      /* inputFechasEstadoCitas: new FormControl(''),
      inputFechasTipoSeguro: new FormControl(''), */
      
    });
  }

  ngOnInit(): void {
    this.ObtenerConfiguracion();
  }
  ObtenerConfiguracion(){                     
    forkJoin([        
      this.pacienteService.ObtenerPais(), 
      this.pacienteService.ObtenerDepartamento(),
      this.pacienteService.ObtenerProvincia(),
      this.pacienteService.ObtenerDistrito()
  ]
  )
  .subscribe(
    data => {               
      localStorage.setItem('Paises', JSON.stringify(data[0]));
      localStorage.setItem('Departamento', JSON.stringify(data[1]));
      localStorage.setItem('Provincia', JSON.stringify(data[2]));
      localStorage.setItem('Distrito', JSON.stringify(data[3]));
    },
    err =>{
      console.log(err);        
    } 
  );
}
}
