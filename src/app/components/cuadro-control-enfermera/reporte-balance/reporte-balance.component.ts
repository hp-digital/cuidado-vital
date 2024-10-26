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
  selector: 'app-reporte-balance',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-balance.component.html',
  styleUrl: './reporte-balance.component.css'
})
export class ReporteBalanceComponent implements OnInit {

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
      "fecha": "2023-06-09T16:00:06.347Z",
      "fechaTexto": "2023-06-09 11:00:06",
      "datosCompletos": false,
      "ingreso": {
        "oral": { "primerTurno": "130", "segundoTurno": "130", "total": "260" },
        "parental": { "primerTurno": "1000", "segundoTurno": "1000", "total": "2000" },
        "parentalTratamiento": { "primerTurno": "20", "segundoTurno": "100", "total": "120" },
        "sangre": { "primerTurno": "", "segundoTurno": "", "total": "0" },
        "aguaOxidacion": { "primerTurno": "100.00", "segundoTurno": "100.00", "total": "200.00" },
        "otros": [{ "primerTurno": "0", "segundoTurno": "0", "total": "0" }],
        "sumatoriaTotal": "2580",
        "fechaTexto": "2023-06-09 11:00:06",
        "personalResponsable": {
          "personal": "ALLPOCC ROMERO, AGUSTINA",
          "fechaRegistro": "2023-06-09T16:00:06.347Z"
        }
      },
      "egreso": {
        "orina": { "primerTurno": "1000", "segundoTurno": "900", "total": "1900" },
        "vomito": { "primerTurno": "", "segundoTurno": "", "total": "0" },
        "aspiracion": { "primerTurno": "", "segundoTurno": "", "total": "0" },
        "drenaje": [{ "primerTurno": "0", "segundoTurno": "", "total": "0" }],
        "perdidaIncesante": { "primerTurno": "300.00", "segundoTurno": "300.00", "total": "600.00" },
        "deposiciones": { "primerTurno": "100", "segundoTurno": "40", "total": "140" },
        "otros": [{ "primerTurno": "0", "segundoTurno": "0", "total": "0" }],
        "sumatoriaTotal": "2640",
        "fechaTexto": "2023-06-09 11:00:06",
        "personalResponsable": {
          "personal": "ALLPOCC ROMERO, AGUSTINA",
          "fechaRegistro": "2023-06-09T16:00:06.348Z"
        }
      },
      "balanceHidrico": -60
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
