import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { ControlEpocDTO } from '@models/control-epoc';
import { DesplegableDTO } from '@models/depleglable';

@Component({
  selector: 'app-reporte-cronico',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-cronico.component.html',
  styleUrl: './reporte-cronico.component.css'
})
export class ReporteCronicoComponent implements OnInit {

  dataFormGroup: FormGroup;
  objHistoria=new HistoriaCuidadoDTO();
  idHistoria:number=0;
  verSpinner:boolean = false;

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';

  objControlEpoc: ControlEpocDTO[]=[];

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

    if(objHistoria.ControlEpoc != null){
      objHistoria.ControlEpoc.forEach((element:any) =>{

        let epoc = new ControlEpocDTO();
        epoc.Paciente= element.Paciente;
        epoc.FechaRegistro= element.FechaRegistro;
        epoc.Banno= new DesplegableDTO();
        epoc.Banno.Id = element.Banno.Id;
        epoc.Banno.Nombre = element.Banno.Nombre;
        epoc.Vestido= new DesplegableDTO();
        epoc.Vestido.Id = element.Vestido.Id;
        epoc.Vestido.Nombre = element.Vestido.Nombre;
        epoc.Wc= new DesplegableDTO();
        epoc.Wc.Id = element.Wc.Id;
        epoc.Wc.Nombre = element.Wc.Nombre;
        epoc.Movilidad= new DesplegableDTO();
        epoc.Movilidad.Id = element.Movilidad.Id;
        epoc.Movilidad.Nombre = element.Movilidad.Nombre;
        epoc.Continencia= new DesplegableDTO();
        epoc.Continencia.Id = element.Continencia.Id;
        epoc.Continencia.Nombre = element.Continencia.Nombre;
        epoc.Alimentacion= new DesplegableDTO();
        epoc.Alimentacion.Id = element.Alimentacion.Id;
        epoc.Alimentacion.Nombre = element.Alimentacion.Nombre;
        epoc.ResultadoEscala= new DesplegableDTO();
        epoc.ResultadoEscala.Id = element.ResultadoEscala.Id;
        epoc.ResultadoEscala.Nombre = element.ResultadoEscala.Nombre;
        epoc.Dificultad= element.Dificultad;
        epoc.FaseEpoc= new DesplegableDTO();
        epoc.FaseEpoc.Id = element.FaseEpoc.Id;
        epoc.FaseEpoc.Nombre = element.FaseEpoc.Nombre;
        epoc.FechaDiagnostico= element.FechaDiagnostico;
        epoc.Alcohol= new DesplegableDTO();
        epoc.Alcohol.Id = element.Alcohol.Id;
        epoc.Alcohol.Nombre = element.Alcohol.Nombre;
        epoc.Drogas= new DesplegableDTO();
        epoc.Drogas.Id = element.Drogas.Id;
        epoc.Drogas.Nombre = element.Drogas.Nombre;
        epoc.Tabaco= new DesplegableDTO();
        epoc.Tabaco.Id = element.Tabaco.Id;
        epoc.Tabaco.Nombre = element.Tabaco.Nombre;
        epoc.SistemaRespiratorio= new DesplegableDTO();
        epoc.SistemaRespiratorio.Id = element.SistemaRespiratorio.Id;
        epoc.SistemaRespiratorio.Nombre = element.SistemaRespiratorio.Nombre;
        epoc.SistemaRespiratorioDetalle= element.SistemaRespiratorioDetalle;
        epoc.EvaluacionFuncional= element.EvaluacionFuncional;
        epoc.PlanTrabajo= element.PlanTrabajo;

        this.objControlEpoc.push(epoc);
      });
    }
    console.log("obj epoc", this.objControlEpoc);
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
