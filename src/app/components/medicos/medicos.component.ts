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

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.css',
  providers: [BsModalService, MessageService],
})
export default class MedicosComponent implements OnInit {

  listaMedicos: ListadoMedicoDTO[] = [];
  autocompleteEspecialidadMedica: any;
  filteredEspecialidad: any[] = [];
  dataFormGroup: FormGroup;
  visible: boolean = false;
  verSpinner: boolean = false;
  comboEspecialidades: ComboDTO[] = [];
  comboPersonalMedico: ListadoMedicoDTO[] = [];
  filteredMedico: any[] = [];

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
            console.log('medicos: ', this.listaMedicos);
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
    throw new Error('Method not implemented.');
  }
  BuscarMedicosPorCriterio() {
    throw new Error('Method not implemented.');
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


}
