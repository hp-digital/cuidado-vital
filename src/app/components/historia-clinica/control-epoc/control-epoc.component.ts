import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboDTO } from '@models/ComboDTO';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { ControlEpocDTO } from '@models/control-epoc';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { DatosMonitoreoService } from '@services/datos-monitoreo.service';
import { HistoriaService } from '@services/historia.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-epoc',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './control-epoc.component.html',
  styles: [`
    :host ::ng-deep ul{
        padding-left:0 !important;
        margin-bottom: 0;
        padding-bottom: 0;
      }
    :host ::ng-deep th{
      border: none;
    }
    :host ::ng-deep .p-autocomplete-multiple-container{
      width:100% 
    }
`],
})
export class ControlEpocComponent implements OnInit {

  dataFormGroup: FormGroup;
  comboFaseEpoc: ComboDTO[] = [];
  verSpinner: boolean = false;

  public onGuardar: any;
  comboBanio: ComboKatzDTO[] = [];
  comboVestido: ComboKatzDTO[] = [];
  comboWC: ComboKatzDTO[] = [];
  comboMovilidad: ComboKatzDTO[] = [];
  comboContinencia: ComboKatzDTO[] = [];
  comboAlimentacion: ComboKatzDTO[] = [];

  objHistoria = new HistoriaCuidadoDTO();
  idHistoria: number = 0;

  objControl: ControlEpocDTO[] = [];

  paciente: string = '';


  constructor(
    private bsModalControlEpoc: BsModalRef,
    private historiaService: HistoriaService,
    private monitoreoService: DatosMonitoreoService,
  ) {
    this.dataFormGroup = new FormGroup({
      selectBanio: new FormControl('', [Validators.required]),
      selectVestido: new FormControl('', [Validators.required]),
      selectWC: new FormControl('', [Validators.required]),
      selectMovilidad: new FormControl('', [Validators.required]),
      selectContinencia: new FormControl('', [Validators.required]),
      selectAlimentacion: new FormControl('', [Validators.required]),
      radKatz: new FormControl('dependiente'),
      selectFaseEpoc: new FormControl('', [Validators.required]),
      inputFechaDiagnostico: new FormControl('', [Validators.required]),
      selectAlcohol: new FormControl('', [Validators.required]),
      selectDrogas: new FormControl('', [Validators.required]),
      selectTabaco: new FormControl('', [Validators.required]),
      radSintomasResp: new FormControl('normal'),
      inputSintomasResp: new FormControl(),
      inputEvalFuncional: new FormControl(),



      inputPlanTrabajo: new FormControl(),
      inputDificultad: new FormControl(),

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
      this.monitoreoService.ObtenerFaseEpoc(),

    ])
      .subscribe(
        data => {
          this.comboBanio = data[0];
          this.comboVestido = data[1];
          this.comboWC = data[2];
          this.comboMovilidad = data[3];
          this.comboContinencia = data[4];
          this.comboAlimentacion = data[5];
          this.comboFaseEpoc = data[6];

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

  AsignarHistoriaClinica(historia: HistoriaCuidadoDTO, idHistoria: number) {

    console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    this.objHistoria.ControlEpoc = this.objControl;
    this.AsignarHistoria(historia);
  }

  AsignarHistoria(historia: any) {

    this.paciente = historia.HistoriaExterna.paciente.apellidoPaterno + ' ' + historia.HistoriaExterna.paciente.apellidoMaterno + ', ' + historia.HistoriaExterna.paciente.nombres;
  }

  Guardar() {


    this.AsignarValores();
    if (this.objControl.length == 0) {
      this.MostrarNotificacionError("Valores Imcompletos", "Error");
    }
    else {
      this.objHistoria.IdHistoriaClinica = this.idHistoria;
      this.objHistoria.ControlEpoc = this.objControl;
      this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
        next: (data) => {
          this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
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

  AsignarValores() {
    let controlEpoc = new ControlEpocDTO();
    controlEpoc.Paciente = this.paciente;
    controlEpoc.ResultadoKatz = this.dataFormGroup.controls['radKatz'].value;
    controlEpoc.Dificultad = this.dataFormGroup.controls['inputDificultad'].value;
    controlEpoc.FechaDiagnostico = this.dataFormGroup.controls['inputFechaDiagnostico'].value;
    controlEpoc.Alcohol = this.dataFormGroup.controls['inputDificultad'].value;
    controlEpoc.Drogas = this.dataFormGroup.controls['inputDificultad'].value;
    controlEpoc.Tabaco = this.dataFormGroup.controls['inputDificultad'].value;
    controlEpoc.SintomasResp = this.dataFormGroup.controls['radSintomasResp'].value;
    controlEpoc.SintomasRespDetalle = this.dataFormGroup.controls['inputSintomasResp'].value;
    controlEpoc.EvaluacionFuncional = this.dataFormGroup.controls['inputEvalFuncional'].value;
    controlEpoc.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value;

    let val_banio = this.comboBanio.find(e => e.id == this.dataFormGroup.controls['selectBanio'].value);
    let aux_banio = val_banio ? { ...val_banio } : new ComboKatzDTO();
    controlEpoc.Banio = aux_banio;

    let val_vestido = this.comboVestido.find(e => e.id == this.dataFormGroup.controls['selectVestido'].value);
    let aux_vestido = val_vestido ? { ...val_vestido } : new ComboKatzDTO();
    controlEpoc.Vestido = aux_vestido;

    let val_WC = this.comboWC.find(e => e.id == this.dataFormGroup.controls['selectWC'].value);
    let aux_WC = val_WC ? { ...val_WC } : new ComboKatzDTO();
    controlEpoc.UsoWC = aux_WC;

    let val_movilidad = this.comboMovilidad.find(e => e.id == this.dataFormGroup.controls['selectMovilidad'].value);
    let aux_movilidad = val_movilidad ? { ...val_movilidad } : new ComboKatzDTO();
    controlEpoc.Movilidad = aux_movilidad;

    let val_continencia = this.comboContinencia.find(e => e.id == this.dataFormGroup.controls['selectContinencia'].value);
    let aux_continencia = val_continencia ? { ...val_continencia } : new ComboKatzDTO();
    controlEpoc.Continencia = aux_continencia;

    let val_alimentacion = this.comboAlimentacion.find(e => e.id == this.dataFormGroup.controls['selectAlimentacion'].value);
    let aux_alimentacion = val_alimentacion ? { ...val_alimentacion } : new ComboKatzDTO();
    controlEpoc.Alimentacion = aux_alimentacion;

    let val_faseEpoc = this.comboFaseEpoc.find(e => e.id == this.dataFormGroup.controls['selectFaseEpoc'].value);
    let aux_faseEpoc = val_faseEpoc ? { ...val_faseEpoc } : new ComboDTO();
    controlEpoc.FaseEpoc = aux_faseEpoc;
     
    //to review -> alcohol/drogas/tabaco
    
    this.objControl.push(controlEpoc);
    console.log(this.objControl);
  }
}
