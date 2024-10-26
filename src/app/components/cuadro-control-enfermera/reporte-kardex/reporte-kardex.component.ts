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
  selector: 'app-reporte-kardex',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-kardex.component.html',
  styleUrl: './reporte-kardex.component.css'
})
export class ReporteKardexComponent implements OnInit {

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
      "idHospitalizacion": 6,
      "fechaHora": "2023-06-05T13:39:54.252Z",
      "fechaHoraTexto": "2023-06-05 08:39:54",
      "cabecera": {
        "paciente": "PACIENTE PRUEBA, VALIDACIONES",
        "nroHistoriaClinica": "10000000",
        "estadoCivil": "SOLTERO(A)",
        "edad": 23,
        "sexo": "MASCULINO",
        "tipoPaciente": "PACIENTE CLÍNICA",
        "nroCama": "705",
        "nroCtaCte": "2306050002"
      },
      "ficha": {
        "servicio": "EMERGENCIA",
        "medicoTratante": "",
        "tipoIntervencionQuirurgica": "",
        "horaIngreso": null,
        "horaEgreso": null,
        "horaIngresoTexto": "INVALID DATE",
        "horaEgresoTexto": "INVALID DATE"
      },
      "fluidoTerapia": {
        "medicacionFluidoTerapia": [
          {
            "medicamento": {
              "id": 1329,
              "nombreGenerico": "AMOXICILINA 250 MG/5ML X 60 ML",
              "nombreComercial": "AMOXICILINA 250 MG/5ML X 60 ML",
              "presentacion": "UNIDAD",
              "stock": 1
            },
            "volumen": 1,
            "soloVia": false,
            "soloViaHeparinizada": false,
            "grupo": 1,
            "responsable": {
              "id": 235,
              "medico": "PALACIOS PORRAS, HERMOGENES",
              "cmp": "0",
              "idEspecialidadMedica": null,
              "especialidad": "EMERGENCIA",
              "fechaRegistro": "2023-06-05T13:36:48.576Z"
            },
            "observaciones": "",
            "cantidad": 0,
            "volumenTipo": null,
            "frecuenciaTiempo": {
              "id": 1,
              "nombre": "C/4 HORAS"
            },
            "duracionTiempo": null,
            "volumenAdministrado": 0,
            "idPrioridadMedicamento": 2,
            "fechaAdministrado": "0001-01-01T00:00:00Z",
            "fechaHora": null,
            "fechaHoraTexto": null
          }
        ]
      }
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
