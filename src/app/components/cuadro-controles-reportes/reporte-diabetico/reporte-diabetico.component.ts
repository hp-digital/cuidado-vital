import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { ControlPresionDTO } from '@models/control-presion';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
import { ControlGlucosaDTO } from '@models/control-glucosa';
import { DesplegableDTO } from '@models/depleglable';

@Component({
  selector: 'app-reporte-diabetico',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-diabetico.component.html',
  styleUrl: './reporte-diabetico.component.css'
})
export class ReporteDiabeticoComponent implements OnInit {

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

  objControlGlucosa : ControlGlucosaDTO[]=[];

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
    let controlGlucosa : ControlGlucosaDTO[] = [];
    if(objHistoria.ControlGlucosa != null){
      objHistoria.ControlGlucosa.forEach((element:any)=>{
        let gluco = new ControlGlucosaDTO();
        gluco.Paciente = element.Paciente;
        gluco.TipoDiabetes = element.TipoDiabetes;
        gluco.FechaDiagnostico = element.FechaDiagnostico ;
        gluco.Complicacion = new DesplegableDTO();
        gluco.Complicacion.Id = element.Complicacion.Id;
        gluco.Complicacion.Nombre = element.Complicacion.Nombre;
        gluco.Retinopatia = new DesplegableDTO();
        gluco.Retinopatia.Id = element.Retinopatia.Id;
        gluco.Retinopatia.Nombre = element.Retinopatia.Nombre;
        gluco.Nefropatia = new DesplegableDTO();
        gluco.Nefropatia.Id = element.Nefropatia.Id;
        gluco.Nefropatia.Nombre = element.Nefropatia.Nombre;
        gluco.Amputacion = new DesplegableDTO();
        gluco.Amputacion.Id = element.Amputacion.Id;
        gluco.Amputacion.Nombre = element.Amputacion.Nombre;
        gluco.Dialisis = new DesplegableDTO();
        gluco.Dialisis.Id = element.Dialisis.Id;
        gluco.Dialisis.Nombre = element.Dialisis.Nombre;
        gluco.Ceguera = new DesplegableDTO();
        gluco.Ceguera.Id = element.Ceguera.Id;
        gluco.Ceguera.Nombre = element.Ceguera.Nombre;
        gluco.TransplanteRenal = new DesplegableDTO();
        gluco.TransplanteRenal.Id = element.TransplanteRenal.Id;
        gluco.TransplanteRenal.Nombre = element.TransplanteRenal.Nombre;
        gluco.Talla = element.Talla;
        gluco.Peso = element.Peso;
        gluco.IMC = element.IMC;
        gluco.PerimetroAbdominal = element.PerimetroAbdominal;
        gluco.PresionArterial = element.PresionArterial;
        gluco.ValorGlucemia = element.ValorGlucemia;
        gluco.FechaGlucemia = element.FechaGlucemia;
        gluco.ValorHba = element.ValorHba;
        gluco.FechaHba = element.FechaHba;
        gluco.ValorCreatinina = element.ValorCreatinina;
        gluco.FechaCreatinina = element.FechaCreatinina;
        gluco.ValorLdl = element.ValorLdl;
        gluco.FechaLdl = element.FechaLdl;
        gluco.ValorTrigliceridos = element.ValorTrigliceridos;
        gluco.FechaTrigliceridos = element.FechaTrigliceridos;
        gluco.ValorMicro = element.ValorMicro;
        gluco.FechaMicro = element.FechaMicro;
        gluco.PlanTrabajo = element.PlanTrabajo;
        gluco.InsulinaMono = element.InsulinaMono;
        gluco.InsulinaDosis = element.InsulinaDosis;
        gluco.MedicamentoMono = element.MedicamentoMono;
        gluco.MedicamentoDosis = element.MedicamentoDosis;
        gluco.FechaRegistro = element.FechaRegistro;
        
        controlGlucosa.push(gluco);
      });
    }
    this.objControlGlucosa = controlGlucosa;
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
