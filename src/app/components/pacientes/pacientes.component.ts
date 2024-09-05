import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import {RegistroPacienteComponent} from './registro-paciente/registro-paciente.component';
import EstadoAtencionComponent from '../atenciones/estado-atencion/estado-atencion.component';
import PagoAtencionComponent from '../atenciones/pago-atencion/pago-atencion.component';
import MotivoAtencionComponent from '../atenciones/motivo-atencion/motivo-atencion.component';
import RegistroAtencionComponent from '../atenciones/registro-atencion/registro-atencion.component';
import { CriterioBusquedaPacienteDTO } from '../../models/CriterioBusquedaPacienteDTO';
import { PacienteService } from '../../services/paciente.service';
import { ComboDTO } from '../../models/ComboDTO';
import { CommonModule } from '@angular/common';
import { ListadoBusquedaPacienteDTO } from '../../models/ListadoBusquedaPacienteDTO';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
  providers: [BsModalService],
})
export default class PacientesComponent implements OnInit {

  dataFormGroup: FormGroup;
  verSpinner: boolean = false;

  comboPaciente:ComboDTO[]=[];

  criterioBusqueda = new CriterioBusquedaPacienteDTO();
  textoCriterioBusqueda:string="";
  visible: boolean = false;

  listadoPacienteBusqueda : ListadoBusquedaPacienteDTO[]=[];
  //modalRef?: BsModalRef;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private modalEstadoAtencion: BsModalService,
    private modalEstadoPagoAtencion: BsModalService,
    private modalMotivoAtencion: BsModalService,
    private modalRegistroAtencion: BsModalService,
    private pacienteService: PacienteService
  ){
    this.dataFormGroup = new FormGroup({
      inputNumeroDocumento: new FormControl(),
      inputPaciente: new FormControl(),
      inputFechaInicio: new FormControl(),
      inputFechaFin: new FormControl()
    });
  }

  ngOnInit(): void {
    this.ObtenerDataInicio();
  }

  ObtenerDataInicio(){
    this.verSpinner = true;

    forkJoin([
      this.pacienteService.ObtenerPacienteCombo(),
    ])
    .subscribe(
      data =>{
        this.comboPaciente = data[0];
      },

      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }
  nuevoPaciente() {
    //this.modalRef = this.modalService.show(HistoriaClinicaComponent, { backdrop: 'static', class: 'modal-xl' });
    this.modalRef = this.modalService.show(RegistroPacienteComponent, { backdrop: 'static', class: 'modal-xl' });
  }
  BuscarPacientes() {
    this.criterioBusqueda = new CriterioBusquedaPacienteDTO();
    this.textoCriterioBusqueda = "";
    let numeroDocumento = this.dataFormGroup.controls['inputNumeroDocumento'].value;
    let idPaciente = this.dataFormGroup.controls['inputPaciente'].value;
    let fechaInicio = this.dataFormGroup.controls['inputFechaInicio'].value;
    let fechaFin = this.dataFormGroup.controls['inputFechaFin'].value;
    if (numeroDocumento != '' && numeroDocumento != null) {
      this.criterioBusqueda.numeroDocumento = numeroDocumento;
    }
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
      console.log("criterio busqueda:",this.textoCriterioBusqueda)
      this.pacienteService.ObtenerPacienteConsulta(this.textoCriterioBusqueda)
        .subscribe({
          next: (data) => {
            if (data.length > 0) {
            console.log('data: ',data);
            this.listadoPacienteBusqueda = data;           
            console.log('data: ',this.listadoPacienteBusqueda);
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
    }
    else {
      this.MostrarNotificacionError('Debe ingresar por lo menos 1 criterio de búsqueda.', '¡Error en la búsqueda!');
    }
  }

  Limpiar() {
    this.dataFormGroup.reset();
/*     this.paciente = "";
    this.especialidad = "";
    this.medico = "";
    this.idEspecialidad = 0;
    this.idMedico = 0;
    this.idPaciente = 0; */
    this.listadoPacienteBusqueda = [];    
    /* this.comboPersonalMedico.forEach(element => {
      this.listaMedicos.push(element.medico);
    }); */
  }

  estadoAtencion(){
    this.modalRef = this.modalEstadoAtencion.show(EstadoAtencionComponent, { backdrop: 'static', class: 'modal-xg' });
  }

  estadoPagoAtencion(){
    this.modalRef = this.modalEstadoPagoAtencion.show(PagoAtencionComponent, { backdrop: 'static', class: 'modal-xg' });
  }

  motivoAtencion(){
    this.modalRef = this.modalMotivoAtencion.show(MotivoAtencionComponent, { backdrop: 'static', class: 'modal-xg' });
  }

  registroAtencion(){
    this.modalRef = this.modalRegistroAtencion.show(RegistroAtencionComponent, { backdrop: 'static', class: 'modal-xl' })
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
