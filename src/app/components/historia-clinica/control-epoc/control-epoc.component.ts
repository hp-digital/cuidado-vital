import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { UtilitiesService } from '@services/utilities.service';
import { HistoriaService } from '@services/historia.service';
import { DatosMonitoreoService } from '@services/datos-monitoreo.service';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { ComboDTO } from '@models/ComboDTO';

@Component({
  selector: 'app-control-epoc',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CommonModule],
  templateUrl: './control-epoc.component.html',
  styleUrl: './control-epoc.component.css'
})
export class ControlEpocComponent implements OnInit {

  dataFormGroup: FormGroup;

  idHistoria:number=0;
  verSpinner:boolean = false;
  objHistoria=new HistoriaCuidadoDTO();

  comboBanio: ComboKatzDTO[] = [];
  comboVestido: ComboKatzDTO[] = [];
  comboWC: ComboKatzDTO[] = [];
  comboMovilidad: ComboKatzDTO[] = [];
  comboContinencia: ComboKatzDTO[] = [];
  comboAlimentacion: ComboKatzDTO[] = [];

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';
  fechaHistoria?:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  comboResultadoKatz: ComboDTO[]=[];
  comboFaseEpoc: ComboDTO[]=[];
  comboHabitoNocivo: ComboDTO[]=[];
  comboSintomaRespiratorio: ComboDTO[]=[];

  constructor(
    private bsModalControlEpoc: BsModalRef,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService,
    private monitoreoService: DatosMonitoreoService,
  ) {
    this.dataFormGroup = new FormGroup({
      selectBanio: new FormControl(),
      selectVestido: new FormControl(),
      selectWC: new FormControl(),
      selectMovilidad: new FormControl(),
      selectContinencia: new FormControl(),
      selectAlimentacion: new FormControl(),
      inputResultadoEscalaKatz: new FormControl(),
      inputDificultad: new FormControl(),
      selectFaseEpoc: new FormControl(),
      selectFechaDiagnostico: new FormControl(),
      selectAlcohol: new FormControl(),
      selectDrogas: new FormControl(),
      selectTabaco: new FormControl(),
      inputSintomaRespiratorio: new FormControl(),
      textSintomaRespiratorio: new FormControl(),
      inputEvaluacionFuncional: new FormControl(),
      inputPlanTrabajo: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();
  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
      this.monitoreoService.ObtenerBanio(),
      this.monitoreoService.ObtenerVestido(),
      this.monitoreoService.ObtenerWC(),
      this.monitoreoService.ObtenerMovilidad(),
      this.monitoreoService.ObtenerContinencia(),
      this.monitoreoService.ObtenerAlimentacion(),

    ])
      .subscribe(
        data => {
          this.comboBanio = data[0];
          this.comboVestido = data[1];
          this.comboWC = data[2];
          this.comboMovilidad = data[3];
          this.comboContinencia = data[4];
          this.comboAlimentacion = data[5];

          this.verSpinner = false;
        },
        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      )
  }

  CerrarModal() {
    this.bsModalControlEpoc.hide();
    //this.onGuardar();
  }

  Guardar(){
    this.MostrarNotificacionSuccessModal("Control guardado con éxito", "Éxito");
    this.CerrarModal();
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){

    console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    this.AsignarObjetoHistoria(historia);
    this.comboResultadoKatz = this.utilitiesService.ObtenerComboResultadoKatz();
    this.comboFaseEpoc = this.utilitiesService.ObtenerComboFaseEpoc();
    this.comboHabitoNocivo = this.utilitiesService.ObtenerComboHabitoNocivo();
    this.comboSintomaRespiratorio = this.utilitiesService.ObtenerComboSintomaRespiratorio();
  }

  AsignarObjetoHistoria(data:any)
  {
    this.verSpinner = true;
    let objHistoria: any = data;
    console.log("asignar",objHistoria);

    this.paciente = this.objHistoria.cabeceraPaciente?.ApellidoMaterno+' '+this.objHistoria.cabeceraPaciente?.ApellidoMaterno+', '+this.objHistoria.cabeceraPaciente?.Nombre;
    this.medico = this.objHistoria.MedicoAtiende?.ApellidoPaterno+' '+this.objHistoria.MedicoAtiende?.ApellidoMaterno+', '+this.objHistoria.MedicoAtiende?.Nombre;
    this.nroHcl = this.objHistoria.cabeceraPaciente?.NumeroDocumento;
    this.fechaHistoria = this.objHistoria.cabeceraPaciente?.FechaAtencion.toString() ;
    /* this.fechaNacimientoPaciente = objHistoria.HistoriaExterna.fechaNacimiento; */
    this.celularPaciente = objHistoria.cabeceraPaciente.Celular ;
    /* this.emailPaciente = objHistoria.HistoriaExterna.paciente.email ;
    this.direccionPaciente = objHistoria.HistoriaExterna.paciente.direccion ;
    this.procedencia = objHistoria.HistoriaExterna.razonSocial; */
    
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

}
