import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { SignoVitalHojaDTO } from '@models/signo-vital-hoja';

@Component({
  selector: 'app-reporte-hoja-monitoreo',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TabViewModule],
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

  objSignoVitalHoja: SignoVitalHojaDTO[] = [];

  headers : (keyof SignoVitalHojaDTO)[] =  [
    "FechaRegistro", "PresionSistolica", "PresionDiastolica", "Pulso", 
    "Temperatura", "FrecuenciaRespiratoria", "Saturacion", "Oxigeno", 
    "Peso", "Deposiciones", "Orina", "Ingresos", "Egresos", "TotalBH"
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
    if(historia.HojaMonitoreoSignos?.SignoVital?.length != 0)
      {
        historia.HojaMonitoreoSignos?.SignoVital?.forEach((element:any) => {
          let sstf = new SignoVitalHojaDTO();
          sstf.FechaRegistro = moment(element.FechaRegistro).format('DD-MM-yyyy HH:mm');
          sstf.PresionSistolica = element.PresionSistolica;
          sstf.PresionDiastolica = element.PresionDiastolica;
          sstf.Pulso = element.Pulso;
          sstf.Temperatura = element.Temperatura;
          sstf.FrecuenciaRespiratoria = element.FrecuenciaRespiratoria;
          sstf.Saturacion = element.Saturacion;
          sstf.Oxigeno = element.Oxigeno;
          sstf.Peso = element.Peso;
          sstf.Deposiciones = element.Deposiciones;
          sstf.Orina = element.Orina;
          sstf.Ingresos = element.Ingresos;
          sstf.Egresos = element.Egresos;
          sstf.TotalBH = element.TotalBH;
  
          this.objSignoVitalHoja.push(sstf);
        });
        
      }
      else{
        this.MostrarNotificacionError("Datos no registrados", "Error");
      }
      this.verSpinner = false;
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
