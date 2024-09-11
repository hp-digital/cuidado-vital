import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotaEnfermeraComponent } from '../historia-clinica/nota-enfermera/nota-enfermera.component';
import { ActividadTecnicaComponent } from '../historia-clinica/actividad-tecnica/actividad-tecnica.component';
import { EpicrisisComponent } from '../historia-clinica/epicrisis/epicrisis.component';
import { ControlGeneralComponent } from '../historia-clinica/control-general/control-general.component';
import { ControlGlucosaComponent } from '../historia-clinica/control-glucosa/control-glucosa.component';
import { ControlPresionComponent } from '../historia-clinica/control-presion/control-presion.component';
import { ControlEpocComponent } from '../historia-clinica/control-epoc/control-epoc.component';

@Component({
  selector: 'app-cuadro-controles',
  standalone: true,
  imports: [],
  templateUrl: './cuadro-controles.component.html',
  styleUrl: './cuadro-controles.component.css'
})
export default class CuadroControlesComponent implements OnInit {

  constructor(
    private modalCuadroControl: BsModalRef,
    private modalService: BsModalService,
    private modalNotaEnfermera: BsModalService,
    private modalPersonalTecnica: BsModalService,
    private modalEpicrisis: BsModalService,
    private modalControlGlucosa: BsModalService,
    private modalControlPresion: BsModalService,
    private modalControlGeneral: BsModalService,
    private modalControlEpoc: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.modalCuadroControl.hide();
    //this.onGuardar();
  }

  AbrirNotaEnfermera(){

    this.modalCuadroControl = this.modalNotaEnfermera.show(NotaEnfermeraComponent, { backdrop: 'static', class: 'modal-xl' })
  }

  AbrirActividadTecnica(){

    this.modalCuadroControl = this.modalPersonalTecnica.show(ActividadTecnicaComponent, { backdrop: 'static', class: 'modal-xl' })
  }

  AbrirEpicrisis(){

    this.modalCuadroControl = this.modalEpicrisis.show(EpicrisisComponent, { backdrop: 'static', class: 'modal-xl' })
  }

  AbrirControlGlucosa(){
    this.modalCuadroControl = this.modalControlGlucosa.show(ControlGlucosaComponent, { backdrop: 'static', class: 'modal-xl' })
  }
  AbrirControlPresion(){
    this.modalCuadroControl = this.modalControlPresion.show(ControlPresionComponent, { backdrop: 'static', class: 'modal-xl' })
  }
  AbrirControlGeneral(){
    this.modalCuadroControl = this.modalControlGeneral.show(ControlGeneralComponent, { backdrop: 'static', class: 'modal-xl' })
  }
  AbrirControlEpoc(){
    this.modalCuadroControl = this.modalControlEpoc.show(ControlEpocComponent, { backdrop: 'static', class: 'modal-xl' })
  }


}
