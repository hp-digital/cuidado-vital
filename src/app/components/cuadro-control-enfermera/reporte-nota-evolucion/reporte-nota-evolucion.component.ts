import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { EvaluacionDTO } from '@models/evaluacion-nota';
import { NotaEnfermeraDTO } from '@models/nota-enfermera';

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

  listadoMedicacion: EvaluacionDTO[] = [];
  listadoProcedimiento: EvaluacionDTO[] = [];
  listadoDiagnostico: EvaluacionDTO[] = [];
  listadoPlanteamiento: EvaluacionDTO[] = [];
  listadoOcurrencia: EvaluacionDTO[] = [];
  listadoPendiente: EvaluacionDTO[] = [];
  listadoEvaluacion: EvaluacionDTO[] = [];
  listadoDiuresis: EvaluacionDTO[] = [];
  listadoDeposicion: EvaluacionDTO[] = [];

  objNotaEnfermera = new NotaEnfermeraDTO();



  constructor(
    private bsModalReporte: BsModalRef,
    private historiaService: HistoriaService,
  ){
    this.dataFormGroup = new FormGroup({
      inputTemperatura: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputSistolica: new FormControl(),
      inputDiastolica: new FormControl(),
      inputSaturacion: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
      inputSubjetivos: new FormControl(),
      inputObjetivos: new FormControl(),
      inputMedicacion: new FormControl(),
      inputProcedimiento: new FormControl(),
      inputDiagnosticoEnfermera: new FormControl(),
      inputPlanteamiento: new FormControl(),
      inputHora: new FormControl(),
      inputDescripcion: new FormControl(),
      inputPendientes: new FormControl(),
      inputEvaluacion: new FormControl(),
      inputDiuresis: new FormControl(),
      inputDeposicion: new FormControl(),
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
    if(historia.NotaEnfermera != null){
      this.dataFormGroup.controls['inputTemperatura'].setValue(historia.NotaEnfermera.SignoVital?.Temperatura)
      this.dataFormGroup.controls['inputFrecuenciaCardiaca'].setValue(historia.NotaEnfermera.SignoVital?.FrecuenciaCardiaca)
      this.dataFormGroup.controls['inputSistolica'].setValue(historia.NotaEnfermera.SignoVital?.PresionSistolica)
      this.dataFormGroup.controls['inputDiastolica'].setValue(historia.NotaEnfermera.SignoVital?.PresionDiastolica)
      this.dataFormGroup.controls['inputSaturacion'].setValue(historia.NotaEnfermera.SignoVital?.SaturacionOxigeno)
      this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].setValue(historia.NotaEnfermera.SignoVital?.FrecuenciaRespiratoria)
    }

    if(historia.NotaEnfermera?.Soapie != null)
      {
        if(historia.NotaEnfermera.Soapie.Subjetivos != null)
        {
          this.dataFormGroup.controls['inputSubjetivos'].setValue(historia.NotaEnfermera.Soapie.Subjetivos);
        }
        if(historia.NotaEnfermera.Soapie.Objetivos != null)
        {
          this.dataFormGroup.controls['inputObjetivos'].setValue(historia.NotaEnfermera.Soapie.Objetivos);
        }
  
        if(historia.NotaEnfermera.Soapie.Medicacion != null)
        {
          historia.NotaEnfermera.Soapie.Medicacion?.forEach((element:any)=>{
            let med = new EvaluacionDTO();
            med.Item = element.Item;
            med.Nota = element.Nota;
            med.FechaNota = element.FechaNota;
            med.Usuario = element.Usuario;
            this.listadoMedicacion.push(med);
          });
        }
        if(historia.NotaEnfermera.Soapie.Procedimiento != null)
        {
          historia.NotaEnfermera.Soapie.Procedimiento?.forEach((element:any)=>{
            let procd = new EvaluacionDTO();
            procd.Item = element.Item;
            procd.Nota = element.Nota;
            procd.FechaNota = element.FechaNota;
            procd.Usuario = element.Usuario;
            this.listadoProcedimiento.push(procd);
          });
        }
        if(historia.NotaEnfermera.Soapie.Diagnostico != null)
        {
          historia.NotaEnfermera.Soapie.Diagnostico?.forEach((element:any)=>{
            let diag = new EvaluacionDTO();
            diag.Item = element.Item;
            diag.Nota = element.Nota;
            diag.FechaNota = element.FechaNota;
            diag.Usuario = element.Usuario;
            this.listadoDiagnostico.push(diag);
          });
        }
        if(historia.NotaEnfermera.Soapie.Planteamiento != null)
        {
          historia.NotaEnfermera.Soapie.Planteamiento?.forEach((element:any)=>{
            let plant = new EvaluacionDTO();
            plant.Item = element.Item;
            plant.Nota = element.Nota;
            plant.FechaNota = element.FechaNota;
            plant.Usuario = element.Usuario;
            this.listadoPlanteamiento.push(plant);
          });
        }
        if(historia.NotaEnfermera.Soapie.Ocurrencias != null)
        {
          historia.NotaEnfermera.Soapie.Ocurrencias?.forEach((element:any)=>{
            let ocu = new EvaluacionDTO();
            ocu.Item = element.Item;
            ocu.Nota = element.Nota;
            ocu.FechaNota = element.FechaNota;
            ocu.Usuario = element.Usuario;
            this.listadoOcurrencia.push(ocu);
          });
        }
        if(historia.NotaEnfermera.Soapie.Pendientes != null)
        {
          historia.NotaEnfermera.Soapie.Pendientes?.forEach((element:any)=>{
            let pend = new EvaluacionDTO();
            pend.Item = element.Item;
            pend.Nota = element.Nota;
            pend.FechaNota = element.FechaNota;
            pend.Usuario = element.Usuario;
            this.listadoPendiente.push(pend);
          });
        }
        if(historia.NotaEnfermera.Soapie.Evaluacion != null)
        {
          historia.NotaEnfermera.Soapie.Evaluacion?.forEach((element:any)=>{
            let eva = new EvaluacionDTO();
            eva.Item = element.Item;
            eva.Nota = element.Nota;
            eva.FechaNota = element.FechaNota;
            eva.Usuario = element.Usuario;
            this.listadoEvaluacion.push(eva);
          });
        }
        if(historia.NotaEnfermera.Soapie.Diuresis != null)
        {
          historia.NotaEnfermera.Soapie.Diuresis?.forEach((element:any)=>{
            let diu = new EvaluacionDTO();
            diu.Item = element.Item;
            diu.Nota = element.Nota;
            diu.FechaNota = element.FechaNota;
            diu.Usuario = element.Usuario;
            this.listadoDiuresis.push(diu);
          });
        }
        if(historia.NotaEnfermera.Soapie.Deposicion != null)
        {
          historia.NotaEnfermera.Soapie.Deposicion?.forEach((element:any)=>{
            let depo = new EvaluacionDTO();
            depo.Item = element.Item;
            depo.Nota = element.Nota;
            depo.FechaNota = element.FechaNota;
            depo.Usuario = element.Usuario;
            this.listadoDeposicion.push(depo);
          });
        }
      }
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
