import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { BalanceHidricoDetalleDTO } from '@models/balance-hidrico-detalle';
import { BalanceHidricoTurnoDTO } from '@models/balance-hidrico-turno';
import { BalanceHidricoEgresoDTO } from '@models/balance-hidrico-egreso';
import { BalanceHidricoIngresoDTO } from '@models/balance-hidrico-ingresos';
import { BalanceHidricoDTO } from '@models/balance-hidrico';

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

  listadoOtrosIngreso: BalanceHidricoDetalleDTO[] = [];
  listadoOtrosEgreso: BalanceHidricoDetalleDTO[] = [];
  listadoDrenaje: BalanceHidricoDetalleDTO[] = [];
  listadoBalanceHidrico: BalanceHidricoTurnoDTO[] = [];

  esItemVisualizar: number = 0;
  objBalanceHidrico = new BalanceHidricoDTO();

  verListaIngresosEgresos: boolean = false

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

    let balance = new BalanceHidricoDTO();
    if(historia.BalanceHidrico != null)
    {
      balance.Paciente = historia.BalanceHidrico.Paciente;
      balance.Medico = historia.BalanceHidrico.Medico;
      balance.NroHcl = historia.BalanceHidrico.NroHcl;
      balance.Peso = historia.BalanceHidrico.Peso;
      balance.Talla = historia.BalanceHidrico.Talla;
      balance.IMC = historia.BalanceHidrico.IMC;
      balance.Tiempo = historia.BalanceHidrico.Tiempo;
      balance.Fecha = historia.BalanceHidrico.Fecha;
      balance.FechaTexto = historia.BalanceHidrico.FechaTexto;

      if(historia.BalanceHidrico.BalanceHidrico != null)
      {
        balance.BalanceHidrico = [];
        historia.BalanceHidrico.BalanceHidrico.forEach((element:any)=>{

          let item: any = historia.BalanceHidrico?.BalanceHidrico?.length;
          let hidrico = new BalanceHidricoTurnoDTO();
          hidrico.Item = ++item;
          hidrico.Fecha = element.Fecha;
          hidrico.FechaTexto = element.FechaTexto; 
          hidrico.DatosCompletos = element.DatosCompletos;  
          hidrico.BalanceHidrico = element.BalanceHidrico;

          hidrico.Ingreso = new BalanceHidricoIngresoDTO();
          hidrico.Ingreso.Oral = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.Oral.PrimerTurno = element.Ingreso.Oral.PrimerTurno;
          hidrico.Ingreso.Oral.SegundoTurno = element.Ingreso.Oral.SegundoTurno;
          hidrico.Ingreso.Oral.Total = element.Ingreso.Oral.Total;
          hidrico.Ingreso.ParentalTratamiento = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.ParentalTratamiento.PrimerTurno = element.Ingreso.ParentalTratamiento.PrimerTurno;
          hidrico.Ingreso.ParentalTratamiento.SegundoTurno = element.Ingreso.ParentalTratamiento.SegundoTurno;
          hidrico.Ingreso.ParentalTratamiento.Total = element.Ingreso.ParentalTratamiento.Total;
          hidrico.Ingreso.Sangre = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.Sangre.PrimerTurno = element.Ingreso.Sangre.PrimerTurno;
          hidrico.Ingreso.Sangre.SegundoTurno = element.Ingreso.Sangre.SegundoTurno;
          hidrico.Ingreso.Sangre.Total = element.Ingreso.Sangre.Total;
          hidrico.Ingreso.AguaOxidacion = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.AguaOxidacion.PrimerTurno = element.Ingreso.AguaOxidacion.PrimerTurno;
          hidrico.Ingreso.AguaOxidacion.SegundoTurno = element.Ingreso.AguaOxidacion.SegundoTurno;
          hidrico.Ingreso.AguaOxidacion.Total = element.Ingreso.AguaOxidacion.Total;
          hidrico.Ingreso.Otros = [];
          if (element.Ingreso.Otros != null) {
            element.Ingreso.Otros.forEach((dato: any) => {
              let item: any = hidrico.Ingreso?.Otros?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.Texto;
              otro.PrimerTurno = dato.PrimerTurno;
              otro.SegundoTurno = dato.SegundoTurno;
              otro.Total = dato.Total;
              hidrico.Ingreso?.Otros?.push(otro);
            });
          }
          hidrico.Ingreso.SumatoriaTotal = element.Ingreso.SumatoriaTotal;
          hidrico.Ingreso.Fecha = element.Ingreso.Fecha;
          hidrico.Ingreso.FechaTexto = element.Ingreso.FechaTexto;
          

          hidrico.Egreso = new BalanceHidricoEgresoDTO();
          hidrico.Egreso.Orina = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Orina.PrimerTurno = element.Egreso.Orina.PrimerTurno;
          hidrico.Egreso.Orina.SegundoTurno = element.Egreso.Orina.SegundoTurno;
          hidrico.Egreso.Orina.Total = element.Egreso.Orina.Total;
          hidrico.Egreso.Vomito = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Vomito.PrimerTurno = element.Egreso.Vomito.PrimerTurno;
          hidrico.Egreso.Vomito.SegundoTurno = element.Egreso.Vomito.SegundoTurno;
          hidrico.Egreso.Vomito.Total = element.Egreso.Vomito.Total;
          hidrico.Egreso.Aspiracion = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Aspiracion.PrimerTurno = element.Egreso.Aspiracion.PrimerTurno;
          hidrico.Egreso.Aspiracion.SegundoTurno = element.Egreso.Aspiracion.SegundoTurno;
          hidrico.Egreso.Aspiracion.Total = element.Egreso.Aspiracion.Total;
          hidrico.Egreso.Drenaje = [];
          if (element.Egreso.Drenaje != null) {
            element.Egreso.Drenaje.forEach((dato: any) => {
              let item: any = hidrico.Egreso?.Drenaje?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.Texto;
              otro.PrimerTurno = dato.PrimerTurno;
              otro.SegundoTurno = dato.SegundoTurno;
              otro.Total = dato.Total;
              hidrico.Egreso?.Drenaje?.push(otro);
            });
          }
          hidrico.Egreso.PerdidaIncesante = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.PerdidaIncesante.PrimerTurno = element.Egreso.PerdidaIncesante.PrimerTurno;
          hidrico.Egreso.PerdidaIncesante.SegundoTurno = element.Egreso.PerdidaIncesante.SegundoTurno;
          hidrico.Egreso.PerdidaIncesante.Total = element.Egreso.PerdidaIncesante.Total;
          hidrico.Egreso.Deposiciones = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Deposiciones.PrimerTurno = element.Egreso.Deposiciones.PrimerTurno;
          hidrico.Egreso.Deposiciones.SegundoTurno = element.Egreso.Deposiciones.SegundoTurno;
          hidrico.Egreso.Deposiciones.Total = element.Egreso.Deposiciones.Total;
          hidrico.Egreso.Otros = [];
          if (element.Egreso.otros != null) {
            element.Egreso.Otros.forEach((dato: any) => {
              let item: any = hidrico.Egreso?.Otros?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.Texto;
              otro.PrimerTurno = dato.PrimerTurno;
              otro.SegundoTurno = dato.SegundoTurno;
              otro.Total = dato.Total;
              hidrico.Egreso?.Otros?.push(otro);
            });
          }
          hidrico.Egreso.SumatoriaTotal = element.Egreso.SumatoriaTotal;
          hidrico.Egreso.Fecha = element.Egreso.Fecha;
          hidrico.Egreso.FechaTexto = element.Egreso.FechaTexto;

          balance.BalanceHidrico?.push(hidrico);
          this.listadoBalanceHidrico.push(hidrico);
        });
        
      }
      
    }

    this.objBalanceHidrico = balance;
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

  VerListaIngresosyEgresos(item: number) {
    this.esItemVisualizar = item;
    this.verListaIngresosEgresos = !this.verListaIngresosEgresos;
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
