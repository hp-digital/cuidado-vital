import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { ComboDTO } from '@models/ComboDTO';
import { UtilitiesService } from '@services/utilities.service';
import { ControlGlucosaDTO } from '@models/control-glucosa';
import { DesplegableDTO } from '@models/depleglable';
import { HistoriaService } from '@services/historia.service';
import { SignoVitalHojaDTO } from '@models/signo-vital-hoja';

@Component({
  selector: 'app-control-glucosa',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CommonModule],
  templateUrl: './control-glucosa.component.html',
  styleUrl: './control-glucosa.component.css'
})
export class ControlGlucosaComponent implements OnInit {
  
  dataFormGroup: FormGroup;

  idHistoria:number=0;
  verSpinner:boolean = false;
  objHistoria=new HistoriaCuidadoDTO();
  objHistoriaExterna = new HistoriaExternaDTO();

  objControlGlucosa : ControlGlucosaDTO[]=[];

  paciente:string = '';
  IMC:number = 0;

  comboSiNo : ComboDTO[]=[];
  comboComplicacion  : ComboDTO[]=[];

  onGuardar:any;

  public eventControl: EventEmitter<ControlGlucosaDTO[]> = new EventEmitter();

  constructor(
    private bsModalControlGlucosa: BsModalRef,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService
  ) {
    this.dataFormGroup = new FormGroup({
      inputTipoDiabetes: new FormControl('', [Validators.required]),
      inputFechaDiagnostico: new FormControl('', [Validators.required]),
      inputComplicaciones: new FormControl('', [Validators.required]),
      inputRetinopatia: new FormControl('', [Validators.required]),
      inputNefropatia: new FormControl('', [Validators.required]),
      inputAmputacion: new FormControl('', [Validators.required]),
      inputDialisis: new FormControl('', [Validators.required]),
      inputCeguera: new FormControl('', [Validators.required]),
      inputTransplante: new FormControl('', [Validators.required]),
      inputPeso: new FormControl('', [Validators.required]),
      inputTalla: new FormControl('', [Validators.required]),
      inputImc: new FormControl('', [Validators.required]),
      inputPerimetroAbdominal: new FormControl('', [Validators.required]),
      inputPerimetroArterial: new FormControl('', [Validators.required]),
      inputValorGlucemia: new FormControl('', [Validators.required]),
      inputFechaGlucemia: new FormControl('', [Validators.required]),
      inputValorHba: new FormControl('', [Validators.required]),
      inputFechaHba: new FormControl('', [Validators.required]),
      inputValorCreatinina: new FormControl('', [Validators.required]),
      inputFechaCreatinina: new FormControl('', [Validators.required]),
      inputValorLdl: new FormControl('', [Validators.required]),
      inputFechaLdl: new FormControl('', [Validators.required]),
      inputValorTrigliceridos: new FormControl('', [Validators.required]),
      inputFechaTrigliceridos: new FormControl('', [Validators.required]),
      inputValorMicroalbuminuria: new FormControl('', [Validators.required]),
      inputFechaMicroalbuminuria: new FormControl('', [Validators.required]),
      inputPlanTrabajo: new FormControl('', [Validators.required]),
      inputMonoInsulina: new FormControl('', [Validators.required]),
      inputDosisInsulina: new FormControl('', [Validators.required]),
      inputMonoMedicamento: new FormControl('', [Validators.required]),
      inputDosisMedicamento: new FormControl('', [Validators.required]),
      inputPerimetroArterialDias: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    //this.ObtenerConfiguracion();
  }

  ObtenerConfiguracion() {
    this.verSpinner = true;
    forkJoin([
      
      ]
    )
      .subscribe(
        data => {

          
          this.verSpinner = false;
        },
        err => {
          this.verSpinner = false;
        }
      );
  }

  CerrarModal() {
    this.bsModalControlGlucosa.hide();
    //this.onGuardar();
  }

  get Controls() {
    return this.dataFormGroup.controls;
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    
    this.idHistoria = idHistoria;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.objHistoria= historia;
    this.comboSiNo = this.utilitiesService.ObtenerSINO();
    this.comboComplicacion = this.utilitiesService.ObtenerComplicaciones();
    console.log("obj historia", this.objHistoria);
    this.AsignarHistoria(historia);
    this.verSpinner = false;
    let objSignos : SignoVitalHojaDTO[]=[]
    if(historia.HojaMonitoreoSignos?.SignoVital != null)
    {
      if(historia.HojaMonitoreoSignos.SignoVital?.length != 0 )
      {
        historia.HojaMonitoreoSignos.SignoVital?.forEach((element : any)=>{
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
          objSignos.push(sstf);
        });
        
        if(objSignos){
          console.log(objSignos);
          this.dataFormGroup.controls['inputPeso'].setValue((objSignos[0].Peso));
          this.dataFormGroup.controls['inputPerimetroArterial'].setValue((objSignos[0].PresionSistolica));
          this.dataFormGroup.controls['inputPerimetroArterialDias'].setValue((objSignos[0].PresionDiastolica));
        }
      }
    }else{
      this.MostrarNotificacionInfo("Ingrese los datos manualmente", "Signos vitales no registrados")
    }
  }

  AsignarHistoria(historia:any)
  {
    this.verSpinner = true;
    let controlGlucosa : ControlGlucosaDTO[] = [];
    if(historia.ControlGlucosa != null){
      historia.ControlGlucosa.forEach((element:any)=>{
        let gluco = new ControlGlucosaDTO();
        gluco.Paciente = element.Paciente;
        gluco.TipoDiabetes = element.TipoDiabetes;
        gluco.FechaDiagnostico = element.FechaDiagnostico ;
        gluco.Complicacion = new DesplegableDTO();
        gluco.Complicacion.Id = element.Complicacion.Id;
        gluco.Complicacion.Nombre = element.Complicacion.Nombre;
        gluco.Retinopatia = new DesplegableDTO();
        gluco.Retinopatia.Id = element.Retinopatia.Id;
        gluco.Retinopatia.Nombre = element.Retinopatia.Nombre;
        gluco.Nefropatia = new DesplegableDTO();
        gluco.Nefropatia.Id = element.Nefropatia.Id;
        gluco.Nefropatia.Nombre = element.Nefropatia.Nombre;
        gluco.Amputacion = new DesplegableDTO();
        gluco.Amputacion.Id = element.Amputacion.Id;
        gluco.Amputacion.Nombre = element.Amputacion.Nombre;
        gluco.Dialisis = new DesplegableDTO();
        gluco.Dialisis.Id = element.Dialisis.Id;
        gluco.Dialisis.Nombre = element.Dialisis.Nombre;
        gluco.Ceguera = new DesplegableDTO();
        gluco.Ceguera.Id = element.Ceguera.Id;
        gluco.Ceguera.Nombre = element.Ceguera.Nombre;
        gluco.TransplanteRenal = new DesplegableDTO();
        gluco.TransplanteRenal.Id = element.TransplanteRenal.Id;
        gluco.TransplanteRenal.Nombre = element.TransplanteRenal.Nombre;
        gluco.Talla = element.Talla;
        gluco.Peso = element.Peso;
        gluco.IMC = element.IMC;
        gluco.PerimetroAbdominal = element.PerimetroAbdominal;
        gluco.PresionArterial = element.PresionArterial;
        gluco.ValorGlucemia = element.ValorGlucemia;
        gluco.FechaGlucemia = element.FechaGlucemia;
        gluco.ValorHba = element.ValorHba;
        gluco.FechaHba = element.FechaHba;
        gluco.ValorCreatinina = element.ValorCreatinina;
        gluco.FechaCreatinina = element.FechaCreatinina;
        gluco.ValorLdl = element.ValorLdl;
        gluco.FechaLdl = element.FechaLdl;
        gluco.ValorTrigliceridos = element.ValorTrigliceridos;
        gluco.FechaTrigliceridos = element.FechaTrigliceridos;
        gluco.ValorMicro = element.ValorMicro;
        gluco.FechaMicro = element.FechaMicro;
        gluco.PlanTrabajo = element.PlanTrabajo;
        gluco.InsulinaMono = element.InsulinaMono;
        gluco.InsulinaDosis = element.InsulinaDosis;
        gluco.MedicamentoMono = element.MedicamentoMono;
        gluco.MedicamentoDosis = element.MedicamentoDosis;
        gluco.FechaRegistro = element.FechaRegistro;
        
        controlGlucosa.push(gluco);
      });
    }
    this.objControlGlucosa = controlGlucosa;

  }

  Guardar(){
    this.AgregarValoresObjeto();
    this.objHistoria.ControlGlucosa = this.objControlGlucosa;
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    console.log("historia guardar", this.objHistoria);

    this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
      next: (data) => {
        this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
        this.eventControl.emit(this.objControlGlucosa)
        this.CerrarModal();
      },
      error: (e) => {
        console.log('Error: ', e);
        this.verSpinner = false;
      },
      complete: () => { this.verSpinner = false; }
    });

  }

  AgregarValoresObjeto(){
    
    let glucosa = new ControlGlucosaDTO();
    glucosa.Paciente= this.paciente;
    glucosa.TipoDiabetes= this.dataFormGroup.controls['inputTipoDiabetes'].value;
    glucosa.FechaDiagnostico= this.dataFormGroup.controls['inputFechaDiagnostico'].value;
    let complicacion = new DesplegableDTO();
    complicacion.Id=this.dataFormGroup.controls['inputComplicaciones'].value;
    let _com = this.comboComplicacion.filter(s => s.id == complicacion.Id)
    if(_com!=null)
      complicacion.Nombre=_com[0]['nombre'];
    glucosa.Complicacion= complicacion;

    let retino = new DesplegableDTO();
    retino.Id= this.dataFormGroup.controls['inputRetinopatia'].value;
    let _ret = this.comboSiNo.filter(s => s.id = retino.Id)
    if(_ret!=null)
      retino.Nombre = _ret[0]['nombre'];
    glucosa.Retinopatia= retino;


    let nefro = new DesplegableDTO();
    nefro.Id= this.dataFormGroup.controls['inputNefropatia'].value;
    let _nef = this.comboSiNo.filter(s => s.id = nefro.Id)
    if(_nef!=null)
      nefro.Nombre = _nef[0]['nombre'];
    glucosa.Nefropatia= nefro;

    let amput = new DesplegableDTO();
    amput.Id= this.dataFormGroup.controls['inputAmputacion'].value;
    let _amp = this.comboSiNo.filter(s => s.id = amput.Id)
    if(_amp!=null)
      amput.Nombre = _amp[0]['nombre'];
    glucosa.Amputacion= amput;

    let dialisis = new DesplegableDTO();
    dialisis.Id= this.dataFormGroup.controls['inputDialisis'].value;
    let _dial = this.comboSiNo.filter(s => s.id = dialisis.Id)
    if(_dial!=null)
      dialisis.Nombre = _dial[0]['nombre'];
    glucosa.Dialisis= dialisis;

    let ceguera = new DesplegableDTO();
    ceguera.Id= this.dataFormGroup.controls['inputCeguera'].value;
    let _ceg= this.comboSiNo.filter(s => s.id = ceguera.Id)
    if(_ceg!=null)
      ceguera.Nombre = _ceg[0]['nombre'];
    glucosa.Ceguera= ceguera;

    let transplante = new DesplegableDTO();
    transplante.Id= this.dataFormGroup.controls['inputTransplante'].value;
    let _trans = this.comboSiNo.filter(s => s.id = transplante.Id)
    if(_trans!=null)
      transplante.Nombre = _trans[0]['nombre'];
    glucosa.TransplanteRenal= transplante;

    glucosa.Talla= this.dataFormGroup.controls['inputTalla'].value;
    glucosa.Peso= this.dataFormGroup.controls['inputPeso'].value;
    glucosa.IMC= this.dataFormGroup.controls['inputImc'].value;
    glucosa.PerimetroAbdominal= this.dataFormGroup.controls['inputPerimetroAbdominal'].value;
    glucosa.PresionArterial= this.dataFormGroup.controls['inputPerimetroArterial'].value ;// + this.dataFormGroup.controls['inputPerimetroArterialDias'].value;
    glucosa.ValorGlucemia= this.dataFormGroup.controls['inputValorGlucemia'].value;
    glucosa.FechaGlucemia= this.dataFormGroup.controls['inputFechaGlucemia'].value;
    glucosa.ValorHba= this.dataFormGroup.controls['inputValorHba'].value;
    glucosa.FechaHba= this.dataFormGroup.controls['inputFechaHba'].value;
    glucosa.ValorCreatinina= this.dataFormGroup.controls['inputValorCreatinina'].value;
    glucosa.FechaCreatinina= this.dataFormGroup.controls['inputFechaCreatinina'].value;
    glucosa.ValorLdl= this.dataFormGroup.controls['inputValorLdl'].value;
    glucosa.FechaLdl= this.dataFormGroup.controls['inputFechaLdl'].value;
    glucosa.ValorTrigliceridos= this.dataFormGroup.controls['inputValorTrigliceridos'].value;
    glucosa.FechaTrigliceridos= this.dataFormGroup.controls['inputFechaTrigliceridos'].value;
    glucosa.ValorMicro= this.dataFormGroup.controls['inputValorMicroalbuminuria'].value;
    glucosa.FechaMicro= this.dataFormGroup.controls['inputFechaMicroalbuminuria'].value;
    glucosa.PlanTrabajo= this.dataFormGroup.controls['inputPlanTrabajo'].value;
    glucosa.InsulinaMono= this.dataFormGroup.controls['inputMonoInsulina'].value;
    glucosa.InsulinaDosis= this.dataFormGroup.controls['inputDosisInsulina'].value;
    glucosa.MedicamentoMono= this.dataFormGroup.controls['inputMonoMedicamento'].value;
    glucosa.MedicamentoDosis= this.dataFormGroup.controls['inputDosisMedicamento'].value;
    glucosa.FechaRegistro= new Date();

    this.objControlGlucosa.push(glucosa);

  }

  CalcularIndiceMasaCorporal(){
    let peso = this.dataFormGroup.controls['inputPeso'].value;
    let talla = this.dataFormGroup.controls['inputTalla'].value;
    if(peso != null && talla != null){
      this.IMC = peso/(talla*talla);
      this.dataFormGroup.controls['inputImc'].setValue((this.IMC).toFixed(1));
    }
  }

  RecuperarValores(){
    let controlGlucosa = new ControlGlucosaDTO();
    controlGlucosa.Paciente = this.paciente;
    controlGlucosa.TipoDiabetes = this.dataFormGroup.controls['inputTipoDiabetes'].value ;
    controlGlucosa.FechaDiagnostico = this.dataFormGroup.controls['inputFechaDiagnostico'].value ;
    let compliCombo = new DesplegableDTO();
    let comp= this.comboComplicacion.find(s => s.id = this.dataFormGroup.controls['inputComplicaciones'].value);
    if(comp != null)
    {
      compliCombo.Id =  comp.id;
      compliCombo.Nombre = comp.nombre ;
    }
    controlGlucosa.Complicacion = compliCombo;
    
    let retiCombo = new DesplegableDTO();
    let reti= this.comboSiNo.find(s => s.id = this.dataFormGroup.controls['inputRetinopatia'].value);
    if(reti != null)
    {
      retiCombo.Id =  reti.id;
      retiCombo.Nombre = reti.nombre ;
    }
    controlGlucosa.Retinopatia = retiCombo ;
    
    let nefroCombo = new DesplegableDTO();
    let nefro= this.comboSiNo.find(s => s.id = this.dataFormGroup.controls['inputNefropatia'].value);
    if(nefro != null)
    {
      nefroCombo.Id =  nefro.id;
      nefroCombo.Nombre = nefro.nombre ;
    }
    controlGlucosa.Nefropatia = nefroCombo;

    let ampuCombo = new DesplegableDTO();
    let ampu= this.comboSiNo.find(s => s.id = this.dataFormGroup.controls['inputAmputacion'].value);
    if(ampu != null)
    {
      ampuCombo.Id =  ampu.id;
      ampuCombo.Nombre = ampu.nombre ;
    }
    controlGlucosa.Amputacion = ampuCombo;

    let dialisisCombo = new DesplegableDTO();
    let dial= this.comboSiNo.find(s => s.id = this.dataFormGroup.controls['inputDialisis'].value);
    if(dial != null)
    {
      dialisisCombo.Id =  dial.id;
      dialisisCombo.Nombre = dial.nombre ;
    }
    controlGlucosa.Dialisis = dialisisCombo;

    let cegueraCombo = new DesplegableDTO();
    let ceguera= this.comboSiNo.find(s => s.id = this.dataFormGroup.controls['inputCeguera'].value);
    if(ceguera != null)
    {
      cegueraCombo.Id =  ceguera.id;
      cegueraCombo.Nombre = ceguera.nombre ;
    }
    controlGlucosa.Ceguera = cegueraCombo;

    let transplanteCombo = new DesplegableDTO();
    let transplante= this.comboSiNo.find(s => s.id = this.dataFormGroup.controls['inputTransplante'].value);
    if(transplante != null)
    {
      transplanteCombo.Id =  transplante.id;
      transplanteCombo.Nombre = transplante.nombre ;
    }
    controlGlucosa.TransplanteRenal = transplanteCombo;

    controlGlucosa.Talla = this.dataFormGroup.controls['inputTalla'].value ;
    controlGlucosa.Peso = this.dataFormGroup.controls['inputPeso'].value ;
    controlGlucosa.IMC = this.dataFormGroup.controls['inputImc'].value ;
    controlGlucosa.PerimetroAbdominal = this.dataFormGroup.controls['inputPerimetroAbdominal'].value ;
    controlGlucosa.PresionArterial = this.dataFormGroup.controls['inputPerimetroArterial'].value ;
    controlGlucosa.ValorGlucemia = this.dataFormGroup.controls['inputValorGlucemia'].value ;
    controlGlucosa.FechaGlucemia = this.dataFormGroup.controls['inputFechaGlucemia'].value ;
    controlGlucosa.ValorHba = this.dataFormGroup.controls['inputValorHba'].value ;
    controlGlucosa.FechaHba = this.dataFormGroup.controls['inputFechaHba'].value ;
    controlGlucosa.ValorCreatinina = this.dataFormGroup.controls['inputValorCreatinina'].value ;
    controlGlucosa.FechaCreatinina = this.dataFormGroup.controls['inputFechaCreatinina'].value ;
    controlGlucosa.ValorLdl = this.dataFormGroup.controls['inputValorLdl'].value ;
    controlGlucosa.FechaLdl = this.dataFormGroup.controls['inputFechaLdl'].value ;
    controlGlucosa.ValorTrigliceridos = this.dataFormGroup.controls['inputValorTrigliceridos'].value ;
    controlGlucosa.FechaTrigliceridos = this.dataFormGroup.controls['inputFechaTrigliceridos'].value ;
    controlGlucosa.ValorMicro = this.dataFormGroup.controls['inputValorMicroalbuminuria'].value ;
    controlGlucosa.FechaMicro = this.dataFormGroup.controls['inputFechaMicroalbuminuria'].value ;
    controlGlucosa.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value ;
    controlGlucosa.InsulinaMono = this.dataFormGroup.controls['inputMonoInsulina'].value ;
    controlGlucosa.InsulinaDosis = this.dataFormGroup.controls['inputDosisInsulina'].value ;
    controlGlucosa.MedicamentoMono = this.dataFormGroup.controls['inputMonoMedicamento'].value ;
    controlGlucosa.MedicamentoDosis = this.dataFormGroup.controls['inputDosisMedicamento'].value ;
    controlGlucosa.FechaRegistro = new Date();

    this.objControlGlucosa.push(controlGlucosa);
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
