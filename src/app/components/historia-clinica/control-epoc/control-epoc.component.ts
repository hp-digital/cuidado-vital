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
import { ControlEpocDTO } from '@models/control-epoc';
import { DesplegableDTO } from '@models/depleglable';

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
  objControlEpoc: ControlEpocDTO[]=[];

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
    this.AgregarDataControl();
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    this.objHistoria.ControlEpoc = this.objControlEpoc;
    console.log("historia a guardar", this.objHistoria);
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

  AgregarDataControl(){

    let epoc = new ControlEpocDTO();
    epoc.Paciente = this.paciente;
    epoc.FechaRegistro = new Date();

    let b = new DesplegableDTO();
    b.Id = this.dataFormGroup.controls['selectBanio'].value;
    let _b = this.comboBanio.filter(s => s.id == b.Id)
    if(_b != null)
      b.Nombre = _b[0]['nombre'];
    epoc.Banno = b;

    let v = new DesplegableDTO();
    v.Id = this.dataFormGroup.controls['selectVestido'].value;
    let _v = this.comboVestido.filter(s => s.id == v.Id)
    if(_v != null)
      v.Nombre = _v[0]['nombre'];
    epoc.Vestido = v;

    let wc = new DesplegableDTO();
    wc.Id = this.dataFormGroup.controls['selectWC'].value;
    let _wc = this.comboWC.filter(s => s.id == wc.Id)
    if(_wc != null)
      wc.Nombre = _wc[0]['nombre'];
    epoc.Wc = wc;

    let movi = new DesplegableDTO();
    movi.Id = this.dataFormGroup.controls['selectMovilidad'].value;
    let _movi = this.comboMovilidad.filter(s => s.id == movi.Id)
    if(_movi != null)
      movi.Nombre = _movi[0]['nombre'];
    epoc.Movilidad = movi;

    let conti = new DesplegableDTO();
    conti.Id = this.dataFormGroup.controls['selectContinencia'].value;
    let _conti = this.comboContinencia.filter(s => s.id == conti.Id)
    if(_conti != null)
      conti.Nombre = _conti[0]['nombre'];
    epoc.Continencia = conti;

    let ali = new DesplegableDTO();
    ali.Id = this.dataFormGroup.controls['selectAlimentacion'].value;
    let _ali = this.comboAlimentacion.filter(s => s.id == ali.Id)
    if(_ali != null)
      ali.Nombre = _ali[0]['nombre'];
    epoc.Alimentacion = ali;

    let res = new DesplegableDTO();
    res.Id = this.dataFormGroup.controls['inputResultadoEscalaKatz'].value;
    let _res = this.comboResultadoKatz.filter(s => s.id == res.Id)
    if(_res != null)
      res.Nombre = _res[0]['nombre'];
    epoc.ResultadoEscala = res;

    epoc.Dificultad = this.dataFormGroup.controls['inputDificultad'].value;

    let fas = new DesplegableDTO();
    fas.Id = this.dataFormGroup.controls['selectFaseEpoc'].value;
    let _fas= this.comboFaseEpoc.filter(s => s.id == fas.Id)
    if(_fas != null)
      fas.Nombre = _fas[0]['nombre'];
    epoc.FaseEpoc = fas;

    epoc.FechaDiagnostico = this.dataFormGroup.controls['selectFechaDiagnostico'].value;

    let alc = new DesplegableDTO();
    alc.Id = this.dataFormGroup.controls['selectAlcohol'].value;
    let _alc= this.comboHabitoNocivo.filter(s => s.id == alc.Id)
    if(_alc != null)
      alc.Nombre = _alc[0]['nombre'];
    epoc.Alcohol = alc;

    let dro = new DesplegableDTO();
    dro.Id = this.dataFormGroup.controls['selectDrogas'].value;
    let _dro= this.comboHabitoNocivo.filter(s => s.id == dro.Id)
    if(_dro != null)
      dro.Nombre = _dro[0]['nombre'];
    epoc.Drogas = dro;

    let taba = new DesplegableDTO();
    taba.Id = this.dataFormGroup.controls['selectTabaco'].value;
    let _taba= this.comboHabitoNocivo.filter(s => s.id == taba.Id)
    if(_taba != null)
      taba.Nombre = _taba[0]['nombre'];
    epoc.Tabaco = taba;

    let siste = new DesplegableDTO();
    siste.Id = this.dataFormGroup.controls['inputSintomaRespiratorio'].value;
    let _siste= this.comboHabitoNocivo.filter(s => s.id == siste.Id)
    if(_siste != null)
      siste.Nombre = _siste[0]['nombre'];
    epoc.SistemaRespiratorio = siste;

    epoc.SistemaRespiratorioDetalle = this.dataFormGroup.controls['textSintomaRespiratorio'].value;
    epoc.EvaluacionFuncional = this.dataFormGroup.controls['inputEvaluacionFuncional'].value;
    epoc.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value;

    this.objControlEpoc.push(epoc);
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
    this.celularPaciente = objHistoria.cabeceraPaciente.Celular ;

    if(objHistoria.ControlEpoc != null){
      objHistoria.ControlEpoc.forEach((element:any) =>{

        let epoc = new ControlEpocDTO();
        epoc.Paciente= element.Paciente;
        epoc.FechaRegistro= element.FechaRegistro;
        epoc.Banno= new DesplegableDTO();
        epoc.Banno.Id = element.Banno.Id;
        epoc.Banno.Nombre = element.Banno.Nombre;
        epoc.Vestido= new DesplegableDTO();
        epoc.Vestido.Id = element.Vestido.Id;
        epoc.Vestido.Nombre = element.Vestido.Nombre;
        epoc.Wc= new DesplegableDTO();
        epoc.Wc.Id = element.Wc.Id;
        epoc.Wc.Nombre = element.Wc.Nombre;
        epoc.Movilidad= new DesplegableDTO();
        epoc.Movilidad.Id = element.Movilidad.Id;
        epoc.Movilidad.Nombre = element.Movilidad.Nombre;
        epoc.Continencia= new DesplegableDTO();
        epoc.Continencia.Id = element.Continencia.Id;
        epoc.Continencia.Nombre = element.Continencia.Nombre;
        epoc.Alimentacion= new DesplegableDTO();
        epoc.Alimentacion.Id = element.Alimentacion.Id;
        epoc.Alimentacion.Nombre = element.Alimentacion.Nombre;
        epoc.ResultadoEscala= new DesplegableDTO();
        epoc.ResultadoEscala.Id = element.ResultadoEscala.Id;
        epoc.ResultadoEscala.Nombre = element.ResultadoEscala.Nombre;
        epoc.Dificultad= element.Dificultad;
        epoc.FaseEpoc= new DesplegableDTO();
        epoc.FaseEpoc.Id = element.FaseEpoc.Id;
        epoc.FaseEpoc.Nombre = element.FaseEpoc.Nombre;
        epoc.FechaDiagnostico= element.FechaDiagnostico;
        epoc.Alcohol= new DesplegableDTO();
        epoc.Alcohol.Id = element.Alcohol.Id;
        epoc.Alcohol.Nombre = element.Alcohol.Nombre;
        epoc.Drogas= new DesplegableDTO();
        epoc.Drogas.Id = element.Drogas.Id;
        epoc.Drogas.Nombre = element.Drogas.Nombre;
        epoc.Tabaco= new DesplegableDTO();
        epoc.Tabaco.Id = element.Tabaco.Id;
        epoc.Tabaco.Nombre = element.Tabaco.Nombre;
        epoc.SistemaRespiratorio= new DesplegableDTO();
        epoc.SistemaRespiratorio.Id = element.SistemaRespiratorio.Id;
        epoc.SistemaRespiratorio.Nombre = element.SistemaRespiratorio.Nombre;
        epoc.SistemaRespiratorioDetalle= element.SistemaRespiratorioDetalle;
        epoc.EvaluacionFuncional= element.EvaluacionFuncional;
        epoc.PlanTrabajo= element.PlanTrabajo;

        this.objControlEpoc.push(epoc);
      });
    }
    console.log("epoc", this.objControlEpoc);
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
