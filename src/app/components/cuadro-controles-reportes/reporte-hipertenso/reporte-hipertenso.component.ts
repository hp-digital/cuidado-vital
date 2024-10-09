import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { ControlPresionDTO } from '@models/control-presion';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';

@Component({
  selector: 'app-reporte-hipertenso',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-hipertenso.component.html',
  styleUrl: './reporte-hipertenso.component.css'
})
export class ReporteHipertensoComponent implements OnInit{

  medidasAntropometricas:MedidasAntropometricasDTO[]=[];
  dataFormGroup: FormGroup;
  objHistoria=new HistoriaCuidadoDTO();
  idHistoria:number=0;
  verSpinner:boolean = false;

  objControlPresion:ControlPresionDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';
  fechaHistoria= new Date();
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

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

    let control :  ControlPresionDTO[]=[];
    let medidas : MedidasAntropometricasDTO[]=[];

    if(objHistoria.ControlPresion!=null)
    {
      objHistoria.ControlPresion.forEach((element:any)=>{
        let s = new ControlPresionDTO();
        s.Fecha = element.Fecha;
        s.Paciente = element.Paciente;
        s.PlanTrabajo = element.PlanTrabajo;
        if(element.MedidasAntroprometricas != null)
        {
          element.MedidasAntroprometricas.forEach((sstf:any)=>{
            let _metr = new MedidasAntropometricasDTO();
            _metr.Diastolica = sstf.Diastolica;
            _metr.Sistolica = sstf.Sistolica;
            _metr.Fecha = sstf.Fecha;
            _metr.Fr = sstf.Fr;
            _metr.Pulso = sstf.Pulso;
            _metr.Estado = sstf.Estado;
            medidas.push(_metr);
          });
        }
        s.MedidasAntroprometricas = medidas;
        medidas=[];
        
        control.push(s);
      })
      this.objControlPresion = control;
      //medidas=[];
    }
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
