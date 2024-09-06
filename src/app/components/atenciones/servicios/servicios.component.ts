import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ComboDTO } from '../../../models/ComboDTO';
import { PacienteService } from '../../../services/paciente.service';
import { ServicioServiceService } from '../../../services/servicio.service.service';
import { PersonalService } from '../../../services/personal.service';
import { ListadoMedicoDTO } from '../../../models/ListadoMedicoDTO';
import { CriterioBusquedaServicioDTO } from '../../../models/CriterioBusquedaServicioDTO';
import { ListadoBusquedaServicioDTO } from '../../../models/ListadoBusquedaServicioDTO';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export default class ServiciosComponent implements OnInit {

  dataFormGroup: FormGroup;
  verSpinner: boolean = false;

  criterioBusqueda = new CriterioBusquedaServicioDTO();
  textoCriterioBusqueda : string ="";
  listadoServicioBusqueda :ListadoBusquedaServicioDTO[]=[]

  comboPaciente:ComboDTO[]=[];
  comboMedico: ListadoMedicoDTO[]=[];

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private pacienteService: PacienteService,
    private servicioService: ServicioServiceService,
    private personalService: PersonalService
  ){
    this.dataFormGroup = new FormGroup({
      inputNumeroDocumento: new FormControl(),
      selectPaciente: new FormControl(),
      inputFechaInicio: new FormControl(),
      inputFechaFin: new FormControl(),
      selectEstadoAtencion: new FormControl(),
      selectMedico: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.ObtenerConfiguracion();
  }

  ObtenerConfiguracion(){
    this.verSpinner = true;

    forkJoin([
      this.pacienteService.ObtenerPacienteCombo(),
      this.personalService.ObtenerListadoMedico()
    ])
    .subscribe(
      data =>{
        this.comboPaciente = data[0];
        this.comboMedico = data[1];
      },

      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }

  Buscar(){
    this.criterioBusqueda = new CriterioBusquedaServicioDTO();
    this.textoCriterioBusqueda = "";
    let numeroDocumento = this.dataFormGroup.controls['inputNumeroDocumento'].value;
    let idPaciente = this.dataFormGroup.controls['selectPaciente'].value;
    let idEstadoAtencion = this.dataFormGroup.controls['selectEstadoAtencion'].value;
    let idMedico  = this.dataFormGroup.controls['selectMedico'].value;
    let fechaInicio = this.dataFormGroup.controls['inputFechaInicio'].value;
    let fechaFin = this.dataFormGroup.controls['inputFechaFin'].value;

    if (numeroDocumento != '' && numeroDocumento != null) {
      this.criterioBusqueda.numeroDocumento = numeroDocumento;
    }
    if (idPaciente != '' && idPaciente != null) {
      this.criterioBusqueda.idPaciente = idPaciente;
    }
    if (idEstadoAtencion != '' && idEstadoAtencion != null) {
      this.criterioBusqueda.idEstadoAtencion = idEstadoAtencion;
    }
    if (idMedico != '' && idMedico != null) {
      this.criterioBusqueda.idMedico = idMedico;
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
      this.servicioService.ObtenerServicioConsulta(this.textoCriterioBusqueda)
        .subscribe({
          next: (data) => {
            if (data.length > 0) {
            console.log('data: ',data);
            this.listadoServicioBusqueda = data;           
            console.log('data: ',this.listadoServicioBusqueda);
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

  Limpiar(){
    this.dataFormGroup.reset();
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
