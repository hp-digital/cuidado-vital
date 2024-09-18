import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnamnesisDTO } from '@models/anamnesis';
import { AntecedentesAnamnesisDTO } from '@models/antecedente-anamnesis';
import { CabeceraPacienteDTO } from '@models/cabecera-paciente';
import { DiagnosticoCuidadoDTO } from '@models/diagnostico-cuidado';
import { ExamenFisicoDTO } from '@models/examen-fisico';
import { ExamenRegionalDTO } from '@models/examen-regional';
import { FuncionBiologicaDTO } from '@models/funcion-biologica';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { MedicoAtiendeDTO } from '@models/medico-atiende';
import { PacienteExternoDTO } from '@models/paciente-externo';
import { SignoVitalDTO } from '@models/signo-vital';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlGeneralDTO } from '@models/control-general';
import { HistoriaService } from '@services/historia.service';

@Component({
  selector: 'app-control-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './control-general.component.html',
  styleUrl: './control-general.component.css'
})
export class ControlGeneralComponent implements OnInit {

  dataFormGroup: FormGroup;

  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();

  objAnamnesis = new AnamnesisDTO();
  objFuncionBiologica = new FuncionBiologicaDTO();
  objExamenFisico = new ExamenFisicoDTO();
  objFuncionVital = new SignoVitalDTO();
  objExamenRegional = new ExamenRegionalDTO();
  objDiagnostico : DiagnosticoCuidadoDTO[]=[];
  objHistoriaExterna = new HistoriaExternaDTO();

  objControl : ControlGeneralDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl:string='';
  fechaHistoria:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  constructor(
    private bsModalControlGeneral: BsModalRef,
    private historiaService: HistoriaService
  ) {
    this.dataFormGroup = new FormGroup({
      inputAlergias: new FormControl(),
      inputEscalaKatz: new FormControl(),
      inputTemperatura: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
      inputPresionSistolicaDiastolica: new FormControl(),
      inputSaturacion: new FormControl(),
      inputPeso: new FormControl(),
      inputTalla: new FormControl(),
      inputImc: new FormControl(),
      inputEstadoMentalDetalle: new FormControl(),
      inputEstadoNutricionalDetalle: new FormControl(),
      inputEstadoPsicosocialDetalle: new FormControl(),
      inputEstadoVisionDetalle: new FormControl(),
      inputEstadoAudicion: new FormControl(),
      inputPlanTrabajo: new FormControl()
    });
  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalControlGeneral.hide();
    //this.onGuardar();
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){

    console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    this.objHistoria.ControlGeneral = this.objControl;
    this.AsignarObjetoHistoria(historia);
  }

  AsignarObjetoHistoria(data:any)
  {
    this.verSpinner = true;
    let objHistoria: any = data;

    this.paciente = objHistoria.HistoriaExterna.paciente.apellidoPaterno+' '+objHistoria.HistoriaExterna.paciente.apellidoMaterno+', '+objHistoria.HistoriaExterna.paciente.nombres;
    this.medico = objHistoria.HistoriaExterna.medico.apellidoPaterno+' '+objHistoria.HistoriaExterna.medico.apellidoMaterno+', '+objHistoria.HistoriaExterna.medico.nombres;
    this.nroHcl = objHistoria.HistoriaExterna.paciente.numeroDocumento;
    this.fechaHistoria = objHistoria.FechaInicioAtencion ;
    this.fechaNacimientoPaciente = objHistoria.HistoriaExterna.fechaNacimiento;
    this.celularPaciente = objHistoria.HistoriaExterna.paciente.celular ;
    this.emailPaciente = objHistoria.HistoriaExterna.paciente.email ;
    this.direccionPaciente = objHistoria.HistoriaExterna.paciente.direccion ;
    this.procedencia = objHistoria.HistoriaExterna.razonSocial;
    
  }

  Guardar(){

    this.AsignarValores();
    if(this.objControl.length==0)
    {
      this.MostrarNotificacionError("Valores Imcompletos", "Error");
    }
    else{
      this.objHistoria.IdHistoriaClinica = this.idHistoria;
      this.objHistoria.ControlGeneral = this.objControl;
      this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
        next: (data) => {
          this.MostrarNotificacionSuccessModal('La historia se guardó con éxito.', '');
        },
        error: (e) => {
          console.log('Error: ', e);
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      });
    }
    

    console.log("historia guardar", this.objHistoria);

  }

  AsignarValores()
  {
    let controlGeneral = new ControlGeneralDTO();
    controlGeneral.Paciente = this.paciente ;
    controlGeneral.Alergias = this.dataFormGroup.controls['inputAlergias'].value ;
    controlGeneral.EscalaKatz = this.dataFormGroup.controls['inputEscalaKatz'].value ;
    controlGeneral.Temperatura = this.dataFormGroup.controls['inputTemperatura'].value ;
    controlGeneral.FrecuenciaCardiaca = this.dataFormGroup.controls['inputFrecuenciaCardiaca'].value ;
    controlGeneral.FrecuenciaRespiratoria = this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].value ;
    controlGeneral.PresionArterialSistolicaDistolica = this.dataFormGroup.controls['inputPresionSistolicaDiastolica'].value ;
    controlGeneral.SaturacionOxigeno = this.dataFormGroup.controls['inputSaturacion'].value ;
    controlGeneral.Talla = this.dataFormGroup.controls['inputTalla'].value ;
    controlGeneral.Peso = this.dataFormGroup.controls['inputPeso'].value ;
    controlGeneral.IMC = this.dataFormGroup.controls['inputImc'].value ;
    controlGeneral.EstadoMental = "Normal";// this.dataFormGroup.controls['textareaTiempoEnfermedad'].value ;
    controlGeneral.EstadoMentalDetalle = this.dataFormGroup.controls['inputEstadoMentalDetalle'].value ;
    controlGeneral.EstadoNutricional = "Alterado";//this.dataFormGroup.controls['textareaTiempoEnfermedad'].value ;
    controlGeneral.EstadoNutricionalDetalle = this.dataFormGroup.controls['inputEstadoNutricionalDetalle'].value ;
    controlGeneral.EstadoPsicosocial = "Normal";//this.dataFormGroup.controls['textareaTiempoEnfermedad'].value ;
    controlGeneral.EstadoPsicosocialDetalle = this.dataFormGroup.controls['inputEstadoPsicosocialDetalle'].value ;
    controlGeneral.EstadoVision = "Normal";//this.dataFormGroup.controls['textareaTiempoEnfermedad'].value ;
    controlGeneral.EstadoVisionDetalle = this.dataFormGroup.controls['inputEstadoVisionDetalle'].value ;
    controlGeneral.EstadoAudicion = "Alterado";//this.dataFormGroup.controls['textareaTiempoEnfermedad'].value ;
    controlGeneral.EstadoAudicionDetalle = this.dataFormGroup.controls['inputEstadoAudicion'].value ;
    controlGeneral.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value ;
    console.log(controlGeneral)
    this.objControl.push(controlGeneral);
    console.log(this.objControl)
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string)
  {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }
  MostrarNotificacionError(mensaje: string, titulo:string)
  {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
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
}
