import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatosPacienteComponent } from '../datos-paciente/datos-paciente.component';
import { RecetaComponent } from '../receta/receta.component';
import { ExamenAuxiliarComponent } from '../examen-auxiliar/examen-auxiliar.component';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent implements OnInit {

  constructor(
    private bsModalHistoriaRef: BsModalRef,
    private bsModalRefEditarDatosGenerales: BsModalRef,
    private bsModalReceta: BsModalRef,
    private bsModalOrden: BsModalRef,
    private modalService: BsModalService
  ){}

  ngOnInit(): void {
    
  }
  
  CerrarModal() {
    this.bsModalHistoriaRef.hide();
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
