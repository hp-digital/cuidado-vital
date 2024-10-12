import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { DesplegableDTO } from '@models/depleglable';
import { ControlGeneralDTO } from '@models/control-general';

@Component({
  selector: 'app-reporte-adulto-mayor',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './reporte-adulto-mayor.component.html',
  styleUrl: './reporte-adulto-mayor.component.css'
})
export class ReporteAdultoMayorComponent  implements OnInit{

  dataFormGroup: FormGroup;
  objHistoria=new HistoriaCuidadoDTO();
  idHistoria:number=0;
  verSpinner:boolean = false;
  objControlGeneral: ControlGeneralDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';

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

    if(objHistoria.ControlGeneral != null)
      {
        objHistoria.ControlGeneral.forEach((element:any)=>{
          let control = new ControlGeneralDTO();
          control.Paciente = element.Paciente;
          control.FechaRegistro = element.FechaRegistro;
          control.Alergias = element.Alergias;
          control.Banno = new DesplegableDTO();
          control.Banno.Id = element.Banno.Id;
          control.Banno.Nombre = element.Banno.Nombre;
          control.Vestido= new DesplegableDTO();
          control.Vestido.Id = element.Vestido.Id;
          control.Vestido.Nombre = element.Vestido.Nombre;
          control.Wc= new DesplegableDTO();
          control.Wc.Id = element.Wc.Id;
          control.Wc.Nombre = element.Wc.Nombre;
          control.Movilidad= new DesplegableDTO();
          control.Movilidad.Id = element.Movilidad.Id;
          control.Movilidad.Nombre = element.Movilidad.Nombre;
          control.Continencia= new DesplegableDTO();
          control.Continencia.Id = element.Continencia.Id;
          control.Continencia.Nombre = element.Continencia.Nombre;
          control.Alimentacion= new DesplegableDTO();
          control.Alimentacion.Id = element.Alimentacion.Id;
          control.Alimentacion.Nombre = element.Alimentacion.Nombre;
          control.ResultadoEscalaKatz= new DesplegableDTO();
          control.ResultadoEscalaKatz.Id = element.ResultadoEscalaKatz.Id;
          control.ResultadoEscalaKatz.Nombre = element.ResultadoEscalaKatz.Nombre;
          control.DetalleResultadoKatz = element.DetalleResultadoKatz;
          control.Temperatura = element.Temperatura;
          control.Fc = element.Fc;
          control.Fr = element.Fr;
          control.PresionSistolica = element.PresionSistolica;
          control.PresionDiastolica = element.PresionDiastolica;
          control.Saturacion = element.Saturacion;
          control.Peso = element.Peso;
          control.Talla = element.Talla;
          control.Imc = element.Imc;
          control.FechaHoy = element.FechaHoy;
          control.DiaSemana = element.DiaSemana;
          control.LugarEstamos = element.LugarEstamos;
          control.NumeroTelefono = element.NumeroTelefono;
          control.DireccionCompleta = element.DireccionCompleta;
          control.CuantosAnios = element.CuantosAnios;
          control.DondeNacio = element.DondeNacio;
          control.NombrePresidente = element.NombrePresidente;
          control.PrimerApellidoMadre = element.PrimerApellidoMadre;
          control.ValoracionMental = element.ValoracionMental;
          control.ValoracionMentalDetalle = element.ValoracionMentalDetalle;
          control.Caida = element.Caida;
          control.CaidaDetalle = element.CaidaDetalle;
          control.EstadoNutricional = new DesplegableDTO();
          control.EstadoNutricional.Id = element.EstadoNutricional.Id;
          control.EstadoNutricional.Nombre = element.EstadoNutricional.Nombre;
          control.EstadoNutricionalDetalle = element.EstadoNutricionalDetalle;
          control.EstadoPsicosocial = new DesplegableDTO();
          control.EstadoPsicosocial.Id = element.EstadoPsicosocial.Id;
          control.EstadoPsicosocial.Nombre = element.EstadoPsicosocial.Nombre;
          control.EstadoPsicosocialDetalle = element.EstadoPsicosocialDetalle;
          control.EstadoVision = new DesplegableDTO();
          control.EstadoVision.Id = element.EstadoVision.Id;
          control.EstadoVision.Nombre = element.EstadoVision.Nombre;
          control.EstadoVisionDetalle = element.EstadoVisionDetalle;
          control.EstadoAudicion = new DesplegableDTO();
          control.EstadoAudicion.Id = element.EstadoAudicion.Id;
          control.EstadoAudicion.Nombre = element.EstadoAudicion.Nombre;
          control.EstadoAudicionDetalle = element.EstadoAudicionDetalle;
          control.PlanTrabajo = element.PlanTrabajo;
  
  
          this.objControlGeneral.push(control);
        });
      }
    console.log("obj epoc", this.objControlGeneral);
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
