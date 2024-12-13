import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from '@services/settings.service';
import { PacienteService } from '@services/paciente.service';
import { HistoriaService } from '@services/historia.service';
import { PersonalService } from '@services/personal.service';
import { ListadoMedicoDTO } from '@models/ListadoMedicoDTO';
import { CriterioBusquedaAtencionesDTO } from '@models/CriterioBusquedaAtencionesDTO';
import { ListadoBusquedaAtencionDTO } from '@models/ListadoBusquedaAtencionDTO';
import { DetalleEstadoPacienteComponent } from '../detalle-estado-paciente/detalle-estado-paciente.component';
import { RecetaComponent } from '../../receta/receta.component';
import { ExamenAuxiliarComponent } from '../../examen-auxiliar/examen-auxiliar.component';
import { RecetaPacienteComponent } from '../receta-paciente/receta-paciente.component';
import { CuadroControlesReportesComponent } from '../../cuadro-controles-reportes/cuadro-controles-reportes.component';
import { FuncionesVitalesComponent } from '../../funciones-vitales/funciones-vitales.component';
import { MonitoreoComponent } from '../../monitoreo/monitoreo.component';
import { ChatComponent } from '../../chat/chat.component';
import { SeguimientoAnalisisComponent } from '../../atenciones-obs/seguimiento-analisis/seguimiento-analisis.component';
import { ControlPrenatalComponent } from '../../atenciones-obs/control-prenatal/control-prenatal.component';
import { FuncionVitalObsComponent } from '../../atenciones-obs/funcion-vital-obs/funcion-vital-obs.component';
import { FichaObstetricaComponent } from '../../atenciones-obs/ficha-obstetrica/ficha-obstetrica.component';
import { BitacoraComponent } from '../../atenciones-obs/bitacora/bitacora.component';
import { CuadroControlObsComponent } from '../../atenciones-obs/cuadro-control-obs/cuadro-control-obs.component';

@Component({
  selector: 'app-historia-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './historia-paciente.component.html',
  styleUrl: './historia-paciente.component.css'
})
export default class HistoriaPacienteComponent implements OnInit{
  dataFormGroup: FormGroup;
  verSpinner:boolean = false;
  idRol: number=0;
  idMedico: number=0;
  idPaciente:number=0;
  usuario:string='';

  comboMedico :ListadoMedicoDTO[]=[];

  criterioBusqueda = new CriterioBusquedaAtencionesDTO();
  textoCriterioBusqueda:string="";
  visible: boolean = false;
  listadoAtencionBusqueda : ListadoBusquedaAtencionDTO[]=[];
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private modalReceta: BsModalService,
    private modalExamenAuxiliar: BsModalService,
    private modalControlesReportes: BsModalService,
    private modalDatoPulsera: BsModalService,
    private modalMonitoreoCamara: BsModalService,
    private modalChat: BsModalService,
    private settings : SettingsService,
    private pacienteService : PacienteService,
    private historiaService: HistoriaService,
    private pesonalService: PersonalService
  ){
    this.dataFormGroup = new FormGroup({
      inputMedico: new FormControl(),
      inputFechaInicio: new FormControl(),
      inputFechaFin: new FormControl()
      
    });
  }

  ngOnInit(): void {
    this.ObtenerConfiguracion();
    this.idRol=this.settings.getUserSetting('idRol');
    this.usuario = this.settings.getUserSetting('usuario');
    //this.idPaciente = this.settings.getUserSetting('idPersonal');
    this.BuscarAtenciones();
  }

  ObtenerConfiguracion(){
    this.verSpinner = true;

    forkJoin([
      this.pesonalService.ObtenerListadoMedico(),
    ])
    .subscribe(
      data =>{
        this.comboMedico = data[0];
      },

      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }

  BuscarAtenciones()
  {
    /* this.criterioBusqueda = new CriterioBusquedaAtencionesDTO();
    this.textoCriterioBusqueda = "";
    let idMedico = this.dataFormGroup.controls['inputMedico'].value;
    let fechaInicio = this.dataFormGroup.controls['inputFechaInicio'].value;
    let fechaFin = this.dataFormGroup.controls['inputFechaFin'].value;

    this.criterioBusqueda.idMedico = this.idMedico.toString();

    if (idPaciente != '' && idPaciente != null) {
      this.criterioBusqueda.idPaciente = idPaciente;
    }

    if (fechaInicio != '' && fechaInicio != null)
      this.criterioBusqueda.fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');

    if (fechaFin != '' && fechaFin != null)
      this.criterioBusqueda.fechaFin = moment(fechaFin).format('YYYY-MM-DD');

    let contadorParametros = 0;
    new Map(Object.entries(this.criterioBusqueda)).forEach((value, key, map) => {
      this.textoCriterioBusqueda += `${key}=${value}&`;
      contadorParametros++;
    });

    this.textoCriterioBusqueda = this.textoCriterioBusqueda.substring(0, this.textoCriterioBusqueda.length - 1);
    if (this.textoCriterioBusqueda == "" || contadorParametros == 0) {
      this.MostrarNotificacionError('Debe ingresar por lo menos 1 criterio de búsqueda.', '¡Error en la búsqueda!');
      return;
    }

    if (this.textoCriterioBusqueda != "") {
      this.verSpinner = true;
      console.log("criterio busqueda:",this.textoCriterioBusqueda) */
      this.historiaService.ObtenerServicioConsulta(this.textoCriterioBusqueda)
        .subscribe({
          next: (data) => {
            if (data.length > 0) {
            console.log('data: ',data);
            this.listadoAtencionBusqueda = data.filter(s => s.numeroDocumento == this.usuario);           
            console.log('data: ',this.listadoAtencionBusqueda);
            }
            else {
              this.MostrarNotificacionWarning('Intente con otros criterios de búsqueda.', '¡No se encontró información!');
            }
          },
          error: (e) => {
            this.MostrarNotificacionError('Por favor intente de nuevo.', '¡Hubo un error en la búsqueda!');
            this.verSpinner = false;
          },
          complete: () => { this.verSpinner = false; }
        });
    /* }
    else {
      this.MostrarNotificacionError('Debe ingresar por lo menos 1 criterio de búsqueda.', '¡Error en la búsqueda!');
    } */
  }
  
  Limpiar() {
    this.dataFormGroup.reset();
    this.listadoAtencionBusqueda = [];    

  }
  AbrirHistoria(idHistoriaClinica:number) {//////////
    
    this.modalRef = this.modalService.show(DetalleEstadoPacienteComponent, { backdrop: 'static', class: 'modal-xl' });
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
      /* this.modalRef.content.onGuardar = () => {
        this.obtenerHistoriaClinica(idHistoriaClinica);
      }; */
  }
  AbrirRecetas(idHistoriaClinica:number){
    this.modalRef = this.modalReceta.show(RecetaComponent, { backdrop: 'static', class: 'modal-xl' })
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }

  AbrirExamenAuxiliar(idHistoriaClinica: number){
    this.modalRef = this.modalExamenAuxiliar.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-xl' })
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }

  AbrirControlesReporte(idHistoriaClinica:number, idEspecialidad:number){
    this.modalRef = this.modalControlesReportes.show(CuadroControlesReportesComponent, {backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica, idEspecialidad);
  }

  AbrirDatosPulsera(idHistoriaClinica: number){
    this.modalRef = this.modalDatoPulsera.show(FuncionesVitalesComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirMonitoreoCamara(idHistoriaClinica:number){
    this.modalRef = this.modalMonitoreoCamara.show(MonitoreoComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirChat(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(ChatComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirFichaObstetrica(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(FichaObstetricaComponent, { backdrop: 'static', class: 'modal-xl'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirControlPreNatal(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(ControlPrenatalComponent, { backdrop: 'static', class: 'modal-xl'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirSeguimiento(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(SeguimientoAnalisisComponent, { backdrop: 'static', class: 'modal-xl'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirFunciones(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(FuncionVitalObsComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  AbrirBitacora(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(BitacoraComponent, { backdrop: 'static', class: 'modal-xl'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }
  MostrarModalControl(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(CuadroControlObsComponent, {backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
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
