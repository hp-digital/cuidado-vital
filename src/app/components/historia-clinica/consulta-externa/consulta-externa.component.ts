import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatosPacienteComponent } from '../../datos-paciente/datos-paciente.component';
import { RecetaComponent } from '../../receta/receta.component';
import { ExamenAuxiliarComponent } from '../../examen-auxiliar/examen-auxiliar.component';

@Component({
  selector: 'app-consulta-externa',
  standalone: true,
  imports: [],
  templateUrl: './consulta-externa.component.html',
  styleUrl: './consulta-externa.component.css'
})
export class ConsultaExternaComponent implements OnInit{

  constructor(
    private modalService: BsModalService,
    private bsModalConsultaExterna: BsModalRef,
    private bsModalRefEditarDatosGenerales: BsModalRef,
    private bsModalReceta: BsModalRef,
    private bsModalOrden: BsModalRef,
  ){

  }
  
  ngOnInit(): void {
    
  }


  CerrarModal() {
    this.bsModalConsultaExterna.hide();
    //this.onGuardar();
  }


  AbrirModalEditarPaciente() {
    this.bsModalRefEditarDatosGenerales = this.modalService.show(DatosPacienteComponent, { backdrop: 'static', class: 'modal-lg' });

  }

  AbrirReceta(){
    this.bsModalReceta = this.modalService.show(RecetaComponent, { backdrop: 'static', class: 'modal-lg' });
  }

  AbrirOrden(){
    this.bsModalOrden = this.modalService.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-lg' });
  }
}
