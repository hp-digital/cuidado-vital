import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { RegistroMedicoComponent } from './registro-medico/registro-medico.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PersonalService } from '@services/personal.service';
import { PacienteService } from '@services/paciente.service';
import { forkJoin } from 'rxjs';
import { ComboDTO } from '@models/ComboDTO';
import { MedicoDTO } from '@models/MedicoDTO';
import { ListadoMedicoDTO } from '@models/ListadoMedicoDTO';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import Swal from 'sweetalert2';
import { CriterioBusquedaMedicoDTO } from '@models/CriterioBusquedaMedicoDTO';
import moment from 'moment';
import { ListadoBusquedaMedicoDTO } from '@models/ListadoBusquedaMedicoDTO';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.css',
  providers: [BsModalService, MessageService],
})
export default class MedicosComponent implements OnInit {

  listaMedicos: ListadoMedicoDTO[] = [];
  listadoMedicoBusqueda: ListadoBusquedaMedicoDTO[]=[];
  autocompleteEspecialidadMedica: any;
  filteredEspecialidad: any[] = [];
  dataFormGroup: FormGroup;
  visible: boolean = false;
  verSpinner: boolean = false;
  comboEspecialidades: ComboDTO[] = [];
  comboPersonalMedico: ListadoMedicoDTO[] = [];
  filteredMedico: any[] = [];
  criterioBusqueda = new CriterioBusquedaMedicoDTO();
  textoCriterioBusqueda: string = "";

  constructor(
    private modalRef: BsModalRef,
    private messageService: MessageService,
    private personalService: PersonalService,
    private pacienteService: PacienteService,
    private modalService: BsModalService,
  ) {

    this.dataFormGroup = new FormGroup({
      inputNroDocumento: new FormControl(''),
      autocompleteNombreMedico: new FormControl(''),
      inputFechaInicio: new FormControl(''),
      inputFechaFin: new FormControl(''),
      autocompleteEspecialidadMedica: new FormControl(''),

    });
  };

  ngOnInit(): void {
    // this.usuario = this.settings.getUserSetting('usuario');
    // this.idPersonal = this.settings.getUserSetting('idPersonal');
    this.ObtenerConfiguracion();
  }

  ObtenerConfiguracion() {
    this.verSpinner = true;
    forkJoin([
      this.personalService.ObtenerListadoMedico(),
      this.pacienteService.ObtenerEspecialidadMedica(),
    ])
      .subscribe(
        data => {
          this.comboPersonalMedico = data[0];
          this.comboEspecialidades = data[1];

          this.comboPersonalMedico.forEach(element => {
            this.listaMedicos.push(element);
            // console.log('medicos: ', this.listaMedicos);
          });

          this.verSpinner = false;
        },
        err => {
          console.log(err);
          this.verSpinner = false;
        }
      );
  }

  nuevoMedico() {
    this.modalRef = this.modalService.show(RegistroMedicoComponent, { backdrop: 'static', class: 'modal-xl' });
  }

  LimpiarCriterios() {
    this.dataFormGroup.reset();
  }

  BuscarMedicosPorCriterio() {
    this.criterioBusqueda = new CriterioBusquedaMedicoDTO();
    this.textoCriterioBusqueda = "";

    let numeroDocumento = this.dataFormGroup.controls['inputNroDocumento'].value;
    let idPersonal = this.dataFormGroup.controls['autocompleteNombreMedico'].value;
    let idEspecialidadMedica = this.dataFormGroup.controls['autocompleteEspecialidadMedica'].value;
    let fechaInicio = this.dataFormGroup.controls['inputFechaInicio'].value;
    let fechaFin = this.dataFormGroup.controls['inputFechaFin'].value;

    if (numeroDocumento != '' && numeroDocumento != null) {
      this.criterioBusqueda.numeroDocumento = numeroDocumento;
    }
    if (idPersonal != '' && idPersonal != null) {
      this.criterioBusqueda.idPersonal = idPersonal;
    }
    if (idEspecialidadMedica != '' && idEspecialidadMedica != null) {
      this.criterioBusqueda.idEspecialidadMedica = idEspecialidadMedica;
    }
    if (fechaInicio != '' && fechaInicio != null)
      this.criterioBusqueda.fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');

    if (fechaFin != '' && fechaFin != null)
      this.criterioBusqueda.fechaFin = moment(fechaFin).format('YYYY-MM-DD');

    new Map(Object.entries(this.criterioBusqueda)).forEach((value, key, map) => {
      this.textoCriterioBusqueda += `${key}=${value}&`
    });

    this.textoCriterioBusqueda = this.textoCriterioBusqueda.substring(0, this.textoCriterioBusqueda.length - 1);
  
    if (this.textoCriterioBusqueda != "" && this.dataFormGroup.valid) {
      this.verSpinner = true;
      this.personalService.ObtenerMedicosPorCriterio(this.textoCriterioBusqueda)
        .subscribe({
          next: (data) => {
            if (data.length > 0) {
              this.listadoMedicoBusqueda = data;
              console.log('Listado medicos busqueda:', data);
              
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

  darBajaMedico(arg0: any) {
    throw new Error('Method not implemented.');
  }

  modificarMedico(idMedico: number) {
    this.modalRef = this.modalService.show(RegistroMedicoComponent, { backdrop: 'static', class: 'modal-xl' });
    this.modalRef.content.idMedico = idMedico;
    this.modalRef.content.onCancelar = () => { };
    this.modalRef.content.onGuardar = () => {
      this.BuscarMedicosPorCriterio();
    }
  }

  searchEspecialidad(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.comboEspecialidades as any[]).length; i++) {
      let e = (this.comboEspecialidades as any[])[i];
      if (e.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(e);
      }
    }
    this.filteredEspecialidad = filtered;
  }

  searchMedicoxNombre(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.comboPersonalMedico as any[]).length; i++) {
      let e = (this.comboPersonalMedico as any[])[i];
      if (e.medico.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(e);
      }
    }
    this.filteredMedico = filtered;
  }

  MostrarNotificacionError(mensaje: string, titulo: string) {
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
