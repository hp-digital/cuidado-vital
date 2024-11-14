import { CommonModule  } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { SettingsService } from '@services/settings.service';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';

@Component({
  selector: 'app-funcion-vital-obs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './funcion-vital-obs.component.html',
  styleUrl: './funcion-vital-obs.component.css'
})
export class FuncionVitalObsComponent implements OnInit {

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;
  fechaHoy=new Date();

  paciente:string = '';
  medico:string='';
  nroHcl?:string='';

  nombreUsuario:string='';
  apellidoUsuario:string='';

  objHistoria=new HistoriaCuidadoDTO();

  constructor(
    private modalFuncion: BsModalRef,
    private modalService: BsModalService,
    private historiaService: HistoriaService,
    private settingService: SettingsService
  ){
    this.dataFormGroup = new FormGroup({
      inputPresionArterial: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
    });
  }
  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.modalFuncion.hide();
    //this.onGuardar();
  }
  AsignarHistoriaClinica(idHistoria:number){
    
    this.idHistoria = idHistoria;
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(idHistoria),
    ])
      .subscribe(
        data => {
          
          this.AsignarObjetoInicial(data[0]);
          this.verSpinner = false;
        },
        err => {
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
          this.verSpinner = false;
        }
      );  
  }

  AsignarObjetoInicial(data:any){
    this.verSpinner = true;
    let objHistoria: any = data;
    console.log("historia", objHistoria);
    this.paciente = objHistoria.cabeceraPaciente.apellidoPaterno+' '+objHistoria.cabeceraPaciente.apellidoMaterno+', '+objHistoria.cabeceraPaciente.nombre;
    this.nroHcl = objHistoria.cabeceraPaciente.numeroDocumento;


  }

  MostrarNotificacionInfo(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: mensaje
    });
  }

  MostrarNotificacionWarning(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje
    });
  }
  manejadorMensajeErroresGuardar(e: any) {
    if (typeof e != "string") {
      let error = e;
      let arrayErrores: any[] = [];
      let errorValidacion = Object.keys(e);
      if (Array.isArray(errorValidacion)) {
        errorValidacion.forEach((propiedadConError: any) => {
          error[propiedadConError].forEach((mensajeError: any) => {
            if (!arrayErrores.includes(mensajeError['mensaje'])) {
              arrayErrores.push(mensajeError['mensaje']);
            }
          });
        });
        this.MostrarNotificacionError(arrayErrores.join("<br/>"), '¡ERROR EN EL PROCESO!')
      } else {
        this.MostrarNotificacionError("", '¡ERROR EN EL PROCESO!')
      }
    }
    else {
      this.MostrarNotificacionError(e, '¡ERROR EN EL PROCESO!');
    }
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
    this.CerrarModal();
  }
}
