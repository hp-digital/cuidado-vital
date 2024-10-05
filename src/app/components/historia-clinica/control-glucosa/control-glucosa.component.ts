import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { ComboDTO } from '@models/ComboDTO';
import { UtilitiesService } from '@services/utilities.service';
import { ControlGlucosaDTO } from '@models/control-glucosa';
import { DesplegableDTO } from '@models/depleglable';

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

  comboSiNo : ComboDTO[]=[];
  comboComplicacion  : ComboDTO[]=[];

  constructor(
    private bsModalControlGlucosa: BsModalRef,
    private utilitiesService: UtilitiesService
  ) {
    this.dataFormGroup = new FormGroup({
      inputTipoDiabetes: new FormControl(),
      inputFechaDiagnostico: new FormControl(),
      inputComplicaciones: new FormControl(),
      inputRetinopatia: new FormControl(),
      inputNefropatia: new FormControl(),
      inputAmputacion: new FormControl(),
      inputDialisis: new FormControl(),
      inputCeguera: new FormControl(),
      inputTransplante: new FormControl(),
      inputPeso: new FormControl(),
      inputTalla: new FormControl(),
      inputImc: new FormControl(),
      inputPerimetroAbdominal: new FormControl(),
      inputPerimetroArterial: new FormControl(),
      inputValorGlucemia: new FormControl(),
      inputFechaGlucemia: new FormControl(),
      inputValorHba: new FormControl(),
      inputFechaHba: new FormControl(),
      inputValorCreatinina: new FormControl(),
      inputFechaCreatinina: new FormControl(),
      inputValorLdl: new FormControl(),
      inputFechaLdl: new FormControl(),
      inputValorTrigliceridos: new FormControl(),
      inputFechaTrigliceridos: new FormControl(),
      inputValorMicroalbuminuria: new FormControl(),
      inputFechaMicroalbuminuria: new FormControl(),
      inputPlanTrabajo: new FormControl(),
      inputMonoInsulina: new FormControl(),
      inputDosisInsulina: new FormControl(),
      inputMonoMedicamento: new FormControl(),
      inputDosisMedicamento: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.ObtenerConfiguracion();
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

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    
    this.idHistoria = idHistoria;
    this.objHistoria = historia;
    this.AsignarHistoria(historia);
    this.comboSiNo = this.utilitiesService.ObtenerSINO();
    this.comboComplicacion = this.utilitiesService.ObtenerComplicaciones();
    
  }

  AsignarHistoria(historia:any)
  {

    console.log("historia", historia);
    this.paciente = historia.cabeceraPaciente.ApellidoPaterno+' '+historia.cabeceraPaciente.ApellidoMaterno+', '+historia.cabeceraPaciente.Nombre;
    

  }

  Guardar(){
    this.MostrarNotificacionSuccessModal("Control guardado correctamente", "Exito")
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
