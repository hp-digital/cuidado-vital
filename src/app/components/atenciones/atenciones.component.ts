import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import  CuadroControlesComponent  from '../cuadro-controles/cuadro-controles.component';
import { RecetaComponent } from '../receta/receta.component';
import { ExamenAuxiliarComponent } from '../examen-auxiliar/examen-auxiliar.component';

@Component({
  selector: 'app-atenciones',
  standalone: true,
  imports: [],
  templateUrl: './atenciones.component.html',
  styleUrl: './atenciones.component.css',
  providers: [BsModalService],
})
export default class AtencionesComponent implements OnInit{

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private modalControles: BsModalService,
    private modalReceta: BsModalService,
    private modalExamenAuxiliar: BsModalService
  ){
    
  }

  ngOnInit(): void {
    
  }

  showDialog() {
    
    this.modalRef = this.modalService.show(HistoriaClinicaComponent, { backdrop: 'static', class: 'modal-xl' });
  }

  AbrirControles(){

    this.modalRef = this.modalControles.show(CuadroControlesComponent, { backdrop: 'static', class: 'modal-xg' })
  }

  AbrirRecetas(){
    this.modalRef = this.modalReceta.show(RecetaComponent, { backdrop: 'static', class: 'modal-xl' })
  }

  AbrirExamenAuxiliar(){
    this.modalRef = this.modalExamenAuxiliar.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-xl' })
  }
}
