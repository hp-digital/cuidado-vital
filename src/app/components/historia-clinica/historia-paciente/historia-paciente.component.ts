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
            this.listadoAtencionBusqueda = data;           
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
  AbrirHistoria(idHistoriaClinica:number) {
    
    this.modalRef = this.modalService.show(DetalleEstadoPacienteComponent, { backdrop: 'static', class: 'modal-xl' });
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
      /* this.modalRef.content.onGuardar = () => {
        this.obtenerHistoriaClinica(idHistoriaClinica);
      }; */
  }
  AbrirRecetas(idHistoriaClinica:number){
    this.modalRef = this.modalReceta.show(RecetaPacienteComponent, { backdrop: 'static', class: 'modal-xl' })
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }

  AbrirExamenAuxiliar(){
    this.modalRef = this.modalExamenAuxiliar.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-xl' })
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
