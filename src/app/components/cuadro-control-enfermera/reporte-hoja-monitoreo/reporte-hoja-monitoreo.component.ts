import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';

@Component({
  selector: 'app-reporte-hoja-monitoreo',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-hoja-monitoreo.component.html',
  styleUrl: './reporte-hoja-monitoreo.component.css'
})
export class ReporteHojaMonitoreoComponent implements OnInit {

  dataFormGroup: FormGroup;
  objHistoria=new HistoriaCuidadoDTO();
  idHistoria:number=0;
  verSpinner:boolean = false;

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';
  fechaHistoria= new Date();
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  datos: any = {
    "idHospitalizacion": 7,
    "ultimaFechaOrdenMedica": "2023-06-05 14:28:22",
    "cabeceraGraficoSignosVitales": {
      "paciente": this.paciente,
      "nroHistoriaClinica": this.nroHcl,
      "estadoCivil": "SOLTERO(A)",
      "edad": 37,
      "sexo": "FEMENINO",
      "tipoPaciente": "PACIENTE CLÍNICA"
    },
    "registroGraficoSignosVitales": [
      {
        "turno": "1 2024-10-26 11:40:08",
        "fechaTexto": "2024-10-26 11:40:08",
        "presionArterialSistolica": 110,
        "presionArterialDiastolica": 80,
        "pulso": 76,
        "temperatura": 36.6,
        "frecuenciaRespiratoria": 16,
        "saturacionOxigeno": 95,
        "oxigeno": 0,
        "peso": 51,
        "deposiciones": "0",
        "orina": "0",
        "ingresos": 0,
        "egresos": 0,
        "totalBH": 0,
        "personalResponsable": {
          "personal": this.medico,
          "fechaRegistro": "2024-10-26"
        }
      },
      {
        "turno": "1 2024-10-26 11:40:08",
        "fechaTexto": "2024-10-26 11:40:08",
        "presionArterialSistolica": 110,
        "presionArterialDiastolica": 80,
        "pulso": 76,
        "temperatura": 36.6,
        "frecuenciaRespiratoria": 16,
        "saturacionOxigeno": 95,
        "oxigeno": 0,
        "peso": 51,
        "deposiciones": "0",
        "orina": "0",
        "ingresos": 0,
        "egresos": 0,
        "totalBH": 0,
        "personalResponsable": {
          "personal": this.medico,
          "fechaRegistro": "2024-10-26"
        }
      }
    ],
    "personalResponsable": {
      "personal": this.medico,
      "fechaRegistro": new Date()
    }
  };

  constructor(
    private bsModalReporte: BsModalRef,
    private historiaService: HistoriaService,
  ){
    this.dataFormGroup = new FormGroup({

    });
  }

  ngOnInit(): void {
    
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){

    console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    //this.objControlPresion = historia.ControlPresion;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.medico = this.objHistoria.MedicoAtiende?.ApellidoPaterno+' '+this.objHistoria.MedicoAtiende?.ApellidoMaterno+', '+this.objHistoria.MedicoAtiende?.Nombre;
    this.AsignarObjetoHistoria(historia);
  }

  AsignarObjetoHistoria(data:any)
  {
    this.verSpinner = true;
    let objHistoria: any = data;
    console.log("objHistoria",objHistoria);
  
    this.nroHcl = this.objHistoria.cabeceraPaciente?.NumeroDocumento;
    this.fechaHistoria = this.objHistoria.FechaInicioAtencion ;

    this.celularPaciente = objHistoria.cabeceraPaciente.Celular ;

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
  }

  CerrarModal() {
    this.bsModalReporte.hide();
    //this.onGuardar();
  }
}
