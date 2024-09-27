import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CalendarModule } from 'primeng/calendar';
import { DatosMonitoreoService } from '@services/datos-monitoreo.service';
import { DesplegableDTO } from '@models/depleglable';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';


interface medidasAntropometricas {
  fecha: string;
  pa: string;
  fr: string; 
  pulso: string;
  estado: string;
}

@Component({
  selector: 'app-control-presion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule
  ],
  templateUrl: './control-presion.component.html',
  styleUrl: './control-presion.component.css'
})

export class ControlPresionComponent implements OnInit {
  public onGuardar: any;
  verSpinner: boolean = false;
  dataFormGroup: FormGroup;
  medidasPresion: medidasAntropometricas[] = [];
  listaEstadoPresion: DesplegableDTO[] = [];

  constructor(
    private bsModalControlPresion: BsModalRef,
    private monitoreoService: DatosMonitoreoService,
  ) {
    this.dataFormGroup = new FormGroup({
      inputFecha: new FormControl(moment().format('YYYY-MM-DD')),
      inputPASistolica: new FormControl('', [Validators.required]),
      inputPADiastolica: new FormControl('', [Validators.required]),
      inputFR: new FormControl('', [Validators.required]),
      inputPulso: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();
  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
      this.monitoreoService.ObtenerPresion(),
    ])
      .subscribe(
        data => {
          this.listaEstadoPresion = data[0];
          this.verSpinner = false;
        },
        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      )
  }
  
  CerrarModal() {
    this.bsModalControlPresion.hide();
    //this.onGuardar();
  }

  MostrarNotificacionError(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }

  AgregarMedidasPresion() {
    let _ps=  this.dataFormGroup.controls['inputPASistolica'].value;
    let _pd= this.dataFormGroup.controls['inputPADiastolica'].value;

    const m = {
      fecha: moment(this.dataFormGroup.controls['inputFecha'].value).format('YYYY-MM-DD'),
      pa: _ps+'/'+_pd,
      fr: this.dataFormGroup.controls['inputFR'].value,
      pulso: this.dataFormGroup.controls['inputPulso'].value,
      estado: this.CalcularPresion(_ps,_pd),
    }; 

    this.medidasPresion.push(m);
    console.log('Medidas presion: ', this.medidasPresion);
  }

  EliminarFila(index: any) {
    this.medidasPresion.splice(index, 1);
  }

  CalcularPresion(s: number, d: number): string {
    if (s < 80 && d < 60) {
      return 'HIPOTENSION';
    }
    if ((s > 80 && s < 120) && (d > 60 && d < 80)) {
      return 'NORMOTENSION';
    }
    if ((s > 120 && s < 139) && (d > 80 && d < 89)) {
      return 'PREHIPERTENSION';
    }
    if ((s > 140 && s < 159) && (d > 90 && d < 99)) {
      return 'HIPERTENSION G.1';
    }
    if ((s > 160 && s < 180) && (d > 100 && d < 110)) {
      return 'HIPERTENSION G.2';
    }
    if (s > 180 && 110) {
      return 'CRISISHIPERTENSIVA';
    }
    
    return '';
  }


}
