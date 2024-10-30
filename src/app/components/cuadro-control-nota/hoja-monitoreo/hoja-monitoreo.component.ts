import { CommonModule  } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilitiesService } from '@services/utilities.service';
import { HistoriaService } from '@services/historia.service';
import { SignoVitalHojaDTO } from '@models/signo-vital-hoja';
import { HojaMonitoreoSignosDTO } from '@models/hoja-monitoreo';
import { SignoVitalDTO } from '@models/signo-vital';

@Component({
  selector: 'app-hoja-monitoreo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule ],
  templateUrl: './hoja-monitoreo.component.html',
  styleUrl: './hoja-monitoreo.component.css'
})
export class HojaMonitoreoComponent implements OnInit {

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();

  objSignoVitalHoja: SignoVitalHojaDTO[] = [];
  
  paciente:string = '';
  medico:string='';
  nroHcl?:string='';

  headers : (keyof SignoVitalHojaDTO)[] =  [
    "FechaRegistro", "PresionSistolica", "PresionDiastolica", "Pulso", 
    "Temperatura", "FrecuenciaRespiratoria", "Saturacion", "Oxigeno", 
    "Peso", "Deposiciones", "Orina", "Ingresos", "Egresos", "TotalBH"
  ];

  constructor(
    private bsModalHoja: BsModalRef,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService,
  ){
    this.dataFormGroup = new FormGroup({
      inputTemperatura: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputPresionSistolica: new FormControl(),
      inputPresionDiastolica: new FormControl(),
      inputSaturacion: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
      inputTalla: new FormControl(),
      inputPeso: new FormControl(),
      inputOxigeno: new FormControl(),
      inputDeposiciones: new FormControl(),
      inputOrina: new FormControl(),
      inputIngresos: new FormControl(),
      inputEgresos: new FormControl(),
      inputTotalBH: new FormControl(),
    });
  }


  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalHoja.hide();
    //this.onGuardar();
  }

  Agregar(){
    let signo = new SignoVitalHojaDTO();
    signo.FechaRegistro = this.formatDate()?.toString();
    signo.PresionSistolica = this.dataFormGroup.controls['inputPresionSistolica'].value; 
    signo.PresionDiastolica = this.dataFormGroup.controls['inputPresionDiastolica'].value; 
    signo.Pulso = this.dataFormGroup.controls['inputFrecuenciaCardiaca'].value; 
    signo.Temperatura = this.dataFormGroup.controls['inputTemperatura'].value; 
    signo.FrecuenciaRespiratoria = this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].value; 
    signo.Saturacion = this.dataFormGroup.controls['inputSaturacion'].value; 
    signo.Oxigeno = this.dataFormGroup.controls['inputOxigeno'].value; 
    signo.Peso = this.dataFormGroup.controls['inputPeso'].value; 
    signo.Deposiciones = this.dataFormGroup.controls['inputDeposiciones'].value; 
    signo.Orina = this.dataFormGroup.controls['inputOrina'].value; 
    signo.Ingresos = this.dataFormGroup.controls['inputIngresos'].value; 
    signo.Egresos = this.dataFormGroup.controls['inputEgresos'].value; 
    signo.TotalBH = this.dataFormGroup.controls['inputTotalBH'].value; 

    this.objSignoVitalHoja.unshift(signo);

    console.log("sig", this.objSignoVitalHoja);
  }

  formatDate(date= new Date()) {
    return moment(date).format('DD-MM-yyyy hh:mm:ss');
  }

  Guardar(){
    let hojita = new HojaMonitoreoSignosDTO();
    hojita.Paciente = this.paciente;
    hojita.Medico = this.medico;
    hojita.SignoVital = this.objSignoVitalHoja;
    if(this.objSignoVitalHoja.length == 0)
    {
      this.MostrarNotificacionInfo("No se guardó ningún signo vital", "ERROR");
    }
    else
    {
      this.objHistoria.IdHistoriaClinica = this.idHistoria;
      this.objHistoria.HojaMonitoreoSignos = hojita;
      console.log("hc guardar", this.objHistoria);
      this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
        next: (data) => {
          this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
          this.CerrarModal();
        },
        error: (e) => {
          console.log('Error: ', e);
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      });
    }

  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    
    this.idHistoria = idHistoria;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.medico = historia.MedicoAtiende?.ApellidoPaterno+' '+historia.MedicoAtiende?.ApellidoMaterno+', '+historia.MedicoAtiende?.Nombre;
    this.nroHcl = historia.cabeceraPaciente?.NumeroDocumento;
    this.objHistoria= historia;
    console.log("obj historia", historia);

    if(historia.HojaMonitoreoSignos?.SignoVital?.length != 0)
    {
      historia.HojaMonitoreoSignos?.SignoVital?.forEach((element:any) => {
        let sstf = new SignoVitalHojaDTO();
        sstf.FechaRegistro = element.FechaRegistro;
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
    this.CerrarModal();
  }
}
