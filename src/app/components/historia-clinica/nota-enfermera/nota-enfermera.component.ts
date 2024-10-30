import { CommonModule  } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { UtilitiesService } from '@services/utilities.service';
import { HistoriaService } from '@services/historia.service';
import { EvaluacionDTO } from '@models/evaluacion-nota';
import { NotaEnfermeraDTO } from '@models/nota-enfermera';
import { SignoVitalNotaDTO } from '@models/signo-vital-notal';
import { SoapieDTO } from '@models/soapie';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-nota-enfermera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './nota-enfermera.component.html',
  styleUrl: './nota-enfermera.component.css'
})
export class NotaEnfermeraComponent implements OnInit{

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;
  fechaHoy=new Date();

  paciente:string = '';
  medico:string='';
  nroHcl?:string='';

  nombreUsuario:string='';
  apellidoUsuario:string='';

  objHistoria=new HistoriaCuidadoDTO();

  listadoMedicacion: EvaluacionDTO[] = [];
  listadoProcedimiento: EvaluacionDTO[] = [];
  listadoDiagnostico: EvaluacionDTO[] = [];
  listadoPlanteamiento: EvaluacionDTO[] = [];
  listadoOcurrencia: EvaluacionDTO[] = [];
  listadoPendiente: EvaluacionDTO[] = [];
  listadoEvaluacion: EvaluacionDTO[] = [];
  listadoDiuresis: EvaluacionDTO[] = [];
  listadoDeposicion: EvaluacionDTO[] = [];

  constructor(
    private modalNotaEnfermeria: BsModalRef,
    private modalService: BsModalService,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService,
    private settingService: SettingsService
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
    this.nombreUsuario = this.settingService.getUserSetting('nombres');
    this.apellidoUsuario =  this.settingService.getUserSetting('apellidos')
  }
  CerrarModal() {
    this.modalNotaEnfermeria.hide();
    //this.onGuardar();
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    
    this.idHistoria = idHistoria;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.medico = historia.MedicoAtiende?.ApellidoPaterno+' '+historia.MedicoAtiende?.ApellidoMaterno+', '+historia.MedicoAtiende?.Nombre;
    this.nroHcl = historia.cabeceraPaciente?.NumeroDocumento;
    this.objHistoria= historia;
    console.log("obj historia", historia);

    if(historia.HojaMonitoreoSignos?.SignoVital == null)
    {
      this.MostrarNotificacionInfo("No se rellenaron signos vitales en HOJA DE MONITOREO DE SIGNOS", "INFO");
    }
    else{
      this.dataFormGroup.controls['inputTemperatura'].setValue(historia.HojaMonitoreoSignos.SignoVital[0].Temperatura);
      this.dataFormGroup.controls['inputFrecuenciaCardiaca'].setValue(historia.HojaMonitoreoSignos.SignoVital[0].Pulso);
      this.dataFormGroup.controls['inputSistolica'].setValue(historia.HojaMonitoreoSignos.SignoVital[0].PresionSistolica);
      this.dataFormGroup.controls['inputDiastolica'].setValue(historia.HojaMonitoreoSignos.SignoVital[0].PresionDiastolica);
      this.dataFormGroup.controls['inputSaturacion'].setValue(historia.HojaMonitoreoSignos.SignoVital[0].Saturacion);
      this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].setValue(historia.HojaMonitoreoSignos.SignoVital[0].FrecuenciaRespiratoria);
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

  AgregarMedicacion(){
    let Item = this.listadoMedicacion?.length;
    let textoNota = this.dataFormGroup.controls['inputMedicacion'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoMedicacion?.unshift(nota);
      this.dataFormGroup.controls['inputMedicacion'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarProcedimiento(){
    let Item = this.listadoProcedimiento?.length;
    let textoNota = this.dataFormGroup.controls['inputProcedimiento'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoProcedimiento?.unshift(nota);
      this.dataFormGroup.controls['inputProcedimiento'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarDiagnostico(){
    let Item = this.listadoDiagnostico?.length;
    let textoNota = this.dataFormGroup.controls['inputDiagnosticoEnfermera'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoDiagnostico?.unshift(nota);
      this.dataFormGroup.controls['inputDiagnosticoEnfermera'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarPlanteamiento(){
    let Item = this.listadoPlanteamiento?.length;
    let textoNota = this.dataFormGroup.controls['inputPlanteamiento'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoPlanteamiento?.unshift(nota);
      this.dataFormGroup.controls['inputPlanteamiento'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarOcurrencia(){
    let Item = this.listadoOcurrencia?.length;
    let textoNota = this.dataFormGroup.controls['inputDescripcion'].value;
    let hora = this.dataFormGroup.controls['inputHora'].value;
    if (textoNota != null && textoNota != '' && hora != null && hora != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoOcurrencia?.unshift(nota);
      this.dataFormGroup.controls['inputDescripcion'].setValue('');
      this.dataFormGroup.controls['inputHora'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarPendientes(){
    let Item = this.listadoPendiente?.length;
    let textoNota = this.dataFormGroup.controls['inputPendientes'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoPendiente?.unshift(nota);
      this.dataFormGroup.controls['inputPendientes'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarEvaluacion(){
    let Item = this.listadoEvaluacion?.length;
    let textoNota = this.dataFormGroup.controls['inputEvaluacion'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoEvaluacion?.unshift(nota);
      this.dataFormGroup.controls['inputEvaluacion'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarDiuresis(){
    let Item = this.listadoDiuresis?.length;
    let textoNota = this.dataFormGroup.controls['inputDiuresis'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoDiuresis?.unshift(nota);
      this.dataFormGroup.controls['inputDiuresis'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }
  AgregarDeposicion(){
    let Item = this.listadoDeposicion?.length;
    let textoNota = this.dataFormGroup.controls['inputDeposicion'].value;
    if (textoNota != null && textoNota != '') {
      /* this.verificarSubjetivo = false;
      this.verificarListadoSubjetivo = false; */
      let nota = new EvaluacionDTO();
      nota.Item = Item++;
      nota.Nota = textoNota;
      nota.Usuario = this.nombreUsuario + ' '+ this.apellidoUsuario;
      nota.FechaNota = moment().toDate();
      this.listadoDeposicion?.unshift(nota);
      this.dataFormGroup.controls['inputDeposicion'].setValue('');
      /* this.DesactivarSubjetivo(); */
    }
  }

  Guardar(){
    let nota = this.AsignarObjeto();
    console.log("nota", nota);
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    this.objHistoria.NotaEnfermera = nota;
    if(this.objHistoria.NotaEnfermera != null){
      console.log("hc guardar", this.objHistoria);
      this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
        next: (data) => {
          this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
          //this.CerrarModal();
        },
        error: (e) => {
          console.log('Error: ', e);
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      });
    }
    else{
      this.MostrarNotificacionInfo("No se guardó control", "ERROR");
    }
  }

  AsignarObjeto(){
    let notaEnfermera = new NotaEnfermeraDTO();
    notaEnfermera.Paciente = this.paciente;
    notaEnfermera.Medico = this.medico;
    notaEnfermera.NroHcl = this.nroHcl;
    notaEnfermera.FechaNota = new Date();

    let signo = new SignoVitalNotaDTO();
    signo.Temperatura= this.dataFormGroup.controls['inputTemperatura'].value;
    signo.FrecuenciaCardiaca= this.dataFormGroup.controls['inputFrecuenciaCardiaca'].value;
    signo.PresionSistolica= this.dataFormGroup.controls['inputSistolica'].value;
    signo.PresionDiastolica= this.dataFormGroup.controls['inputDiastolica'].value;
    signo.SaturacionOxigeno= this.dataFormGroup.controls['inputSaturacion'].value;
    signo.FrecuenciaRespiratoria= this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].value;

    let soapie = new SoapieDTO();
    soapie.Subjetivos = this.dataFormGroup.controls['inputSubjetivos'].value;
    soapie.Objetivos = this.dataFormGroup.controls['inputObjetivos'].value;
    soapie.Medicacion = [];  
    soapie.Procedimiento = []  ;
    soapie.Diagnostico = []  ;
    soapie.Planteamiento = []  ;
    soapie.Ocurrencias = []  ;
    soapie.Pendientes = []  ;
    soapie.Evaluacion = []  ;
    soapie.Diuresis = []  ;
    soapie.Deposicion = []  ;

    if (Array.isArray(this.listadoMedicacion)) {
      this.listadoMedicacion.forEach(element => {
        soapie.Medicacion?.push(element);
      });
    }
    if (Array.isArray(this.listadoProcedimiento)) {
      this.listadoProcedimiento.forEach(element => {
        soapie.Procedimiento?.push(element);
      });
    }
    if (Array.isArray(this.listadoDiagnostico)) {
      this.listadoDiagnostico.forEach(element => {
        soapie.Diagnostico?.push(element);
      });
    }
    if (Array.isArray(this.listadoPlanteamiento)) {
      this.listadoPlanteamiento.forEach(element => {
        soapie.Planteamiento?.push(element);
      });
    }
    if (Array.isArray(this.listadoOcurrencia)) {
      this.listadoOcurrencia.forEach(element => {
        soapie.Ocurrencias?.push(element);
      });
    }
    if (Array.isArray(this.listadoPendiente)) {
      this.listadoPendiente.forEach(element => {
        soapie.Pendientes?.push(element);
      });
    }
    if (Array.isArray(this.listadoEvaluacion)) {
      this.listadoEvaluacion.forEach(element => {
        soapie.Evaluacion?.push(element);
      });
    }
    if (Array.isArray(this.listadoDiuresis)) {
      this.listadoDiuresis.forEach(element => {
        soapie.Diuresis?.push(element);
      });
    }
    if (Array.isArray(this.listadoDeposicion)) {
      this.listadoDeposicion.forEach(element => {
        soapie.Deposicion?.push(element);
      });
    }

    notaEnfermera.SignoVital = signo;
    notaEnfermera.Soapie = soapie;

    return notaEnfermera;
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
