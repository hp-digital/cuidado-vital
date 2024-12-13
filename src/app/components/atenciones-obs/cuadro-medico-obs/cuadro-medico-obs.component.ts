import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { RecetaComponent } from '../../receta/receta.component';
import { ExamenAuxiliarComponent } from '../../examen-auxiliar/examen-auxiliar.component';
import { HistorialObsteComponent } from '../historial-obste/historial-obste.component';

@Component({
  selector: 'app-cuadro-medico-obs',
  standalone: true,
  imports: [],
  templateUrl: './cuadro-medico-obs.component.html',
  styleUrl: './cuadro-medico-obs.component.css'
})
export class CuadroMedicoObsComponent implements OnInit{

  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();

  BsModalExamenAux!:BsModalRef;
  BsModalReceta!: BsModalRef;
  BsModalHistorial!:BsModalRef;

  constructor(
    private modalCuadroControl: BsModalRef,
    private modalReceta: BsModalService,
    private modalExamen: BsModalService,
    private modalHistoria: BsModalService,
    private historiaService: HistoriaService
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.modalCuadroControl.hide();
    //this.onGuardar();
  }

  AsignarHistoriaClinica(idHistoriaClinica:number, idEspecialidad:number){
    this.idHistoria=idHistoriaClinica;
  }

  AbrirHistorial(idHistoriaClinica: number){
    this.BsModalHistorial = this.modalHistoria.show(HistorialObsteComponent, { backdrop: 'static', class: 'modal-xl'})
    this.BsModalHistorial.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirRecetas(idHistoriaClinica: number){
    this.BsModalReceta = this.modalReceta.show(RecetaComponent, { backdrop: 'static', class: 'modal-xl'})
    this.BsModalReceta.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirExamenes(idHistoriaClinica: number){
    this.BsModalExamenAux = this.modalExamen.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-xl' })
    this.BsModalExamenAux.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }
}
