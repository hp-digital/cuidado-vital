import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaService } from '@services/historia.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ExamenAuxiliarComponent } from '../../examen-auxiliar/examen-auxiliar.component';
import { SeguimientoAnalisisComponent } from '../seguimiento-analisis/seguimiento-analisis.component';
import { ControlPrenatalComponent } from '../control-prenatal/control-prenatal.component';
import { FuncionVitalObsComponent } from '../funcion-vital-obs/funcion-vital-obs.component';
import { FichaObstetricaComponent } from '../ficha-obstetrica/ficha-obstetrica.component';
import { SignosAlarmasComponent } from '../signos-alarmas/signos-alarmas.component';

@Component({
  selector: 'app-cuadro-control-obs',
  standalone: true,
  imports: [],
  templateUrl: './cuadro-control-obs.component.html',
  styleUrl: './cuadro-control-obs.component.css'
})
export class CuadroControlObsComponent implements OnInit{

  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();

  BsModalExamenAux!:BsModalRef;
  BsModalSeguimiento!: BsModalRef;
  BsModalControlPre!:BsModalRef;
  BsModalFunciones!:BsModalRef;
  BsModalSignos!:BsModalRef;

  constructor(
    private modalCuadroControl: BsModalRef,
    private modalReceta: BsModalService,
    private modalExamen: BsModalService,
    private modalHistoria: BsModalService,
    private modalSeguimiento: BsModalService,
    private modalControlPre: BsModalService,
    private modalFunciones: BsModalService,
    private modalSignos: BsModalService,
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
    this.ObtenerConfiguracion(idEspecialidad);
  }

  ObtenerConfiguracion(idEspecialidad:number) {
    /* this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(this.idHistoria),
      this.historiaService.ObtenerHojaMonitoreoEspecialidad(idEspecialidad)
    ])
      .subscribe(
        data => {
          this.AsignarObjetoInicial(data[0]);
          this.hojas= data[1];

          this.verSpinner = false;
        },
        err => {
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
          this.verSpinner = false;
        }
      );
  } */
}

  AbrirFunciones(idHistoriaClinica: number){
    this.BsModalFunciones = this.modalFunciones.show(FuncionVitalObsComponent, { backdrop: 'static', class: 'modal-xg'})
    this.BsModalFunciones.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirControlPreNatal(idHistoriaClinica: number){
    this.BsModalControlPre = this.modalControlPre.show(FichaObstetricaComponent, { backdrop: 'static', class: 'modal-xl'})
    this.BsModalControlPre.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirSeguimiento(idHistoriaClinica: number){
    this.BsModalSeguimiento = this.modalSeguimiento.show(SeguimientoAnalisisComponent, { backdrop: 'static', class: 'modal-xl'})
    this.BsModalSeguimiento.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirExamenAuxiliar(idHistoriaClinica: number){
    this.BsModalExamenAux = this.modalExamen.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-xl' })
    this.BsModalExamenAux.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }
  AbrirSignosAlarmas(idHistoriaClinica: number){
    this.BsModalSignos = this.modalSignos.show(SignosAlarmasComponent, { backdrop: 'static', class: 'modal-xl' })
    this.BsModalSignos.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
}
