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
  selector: 'app-reporte-nota-evolucion',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-nota-evolucion.component.html',
  styleUrl: './reporte-nota-evolucion.component.css'
})
export class ReporteNotaEvolucionComponent implements OnInit{

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

  datos: any = [
    {
      "cabeceraNotasEvolucionControl": {
        "paciente": this.paciente,
        "nroHistoriaClinica": this.nroHcl,
        "estadoCivil": "SOLTERO(A)",
        "edad": 37,
        "sexo": "FEMENINO",
        "tipoPaciente": "PACIENTE CLÍNICA"
      },
      "idHospitalizacion": 9,
      "idMedico": 410,
      "fechaHoraTexto": "2023-06-06 11:25:42",
      "signoVital": [
        {
          "personalResponsable": {
            "personal": this.medico
          },
          "temperatura": 36.5,
          "frecuenciaCardiaca": 87,
          "sistolica": 110,
          "diastolica": 68,
          "saturacionOxigeno": 92,
          "frecuenciaRespiratoria": 20
        }
      ],
      "subjetivo": [
        {
          "personalResponsable": {
            "personal": this.medico
          },
          "nota": "PCTE REFIERE DOLOR EN ZONA DE CIRUGIA"
        }
      ],
      "objetivo": [
        {
          "pielAnexos": [
            { "nombre": "HUMEDA" },
            { "nombre": "TIBIA" }
          ],
          "cabeza": [
            { "nombre": "NORMAL" },
            { "nombre": "NO HIRSUTISMO" },
            { "nombre": "OJOS NORMALES" }
          ]
        }
      ],
      "apresiacion": [
        {
          "personalResponsable": {
            "personal": this.medico
          },
          "nota": "PCTE EN EVOLUCIÓN FAVORABLE"
        }
      ],
      "plan": [
        {
          "personalResponsable": {
            "personal": this.medico
          },
          "nota": "MANEJO DE DOLOR Y ATB"
        }
      ],
      "diagnostico": [
        {
          "codigoCie10": "S92.2",
          "nombreDiagnostico": "S92.2 FRACTURA DE OTRO(S) HUESO(S) DEL TARSO",
          "tipoDiagnostico": {
            "nombre": "DIAGNÓSTICO DEFINITIVO"
          }
        }
      ]
    }
  ];


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
