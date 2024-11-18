import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComboDTO } from '@models/ComboDTO';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from '@services/settings.service';
import { PacienteService } from '@services/paciente.service';
import { HistoriaService } from '@services/historia.service';
import { CriterioBusquedaAtencionesObstetriciaDTO } from '@models/criterio-busqueda-atenciones-obstetricia';
import { ListadoBusquedaAtencionDTO } from '@models/ListadoBusquedaAtencionDTO';
import { NuevoControlComponent } from '../atenciones/nuevo-control/nuevo-control.component';
import { HistorialObsteComponent } from './historial-obste/historial-obste.component';
import { FuncionVitalObsComponent } from './funcion-vital-obs/funcion-vital-obs.component';
import { ControlPrenatalComponent } from './control-prenatal/control-prenatal.component';
import { SeguimientoAnalisisComponent } from './seguimiento-analisis/seguimiento-analisis.component';

@Component({
  selector: 'app-atenciones-obs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,AutoCompleteModule,CalendarModule, InputTextModule],
  templateUrl: './atenciones-obs.component.html',
  styleUrl: './atenciones-obs.component.css'
})
export default class AtencionesObsComponent implements OnInit{

  dataFormGroup: FormGroup;
  verSpinner:boolean = false;
  idRol: number=0;
  idMedico: number=0;

  comboPaciente:ComboDTO[]=[];

  criterioBusqueda = new CriterioBusquedaAtencionesObstetriciaDTO();
  textoCriterioBusqueda:string="";
  visible: boolean = false;
  listadoAtencionBusqueda : ListadoBusquedaAtencionDTO[]=[];

  idPaciente:string = '';
  fechaInicio: Date | undefined;
  numeroDocumento: string='';

  modalControlesRef!: BsModalRef;

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private modalHistoria: BsModalService,
    private settings : SettingsService,
    private pacienteService : PacienteService,
    private historiaService: HistoriaService
  ){
    this.dataFormGroup = new FormGroup({
      inputNumeroDocumento: new FormControl(),
      selectPaciente: new FormControl(),
      selectMonitoreo: new FormControl(),
      
    });

  }

  ngOnInit(): void {
    this.ObtenerConfiguracion();
    this.idRol=this.settings.getUserSetting('idRol');
    this.idMedico = this.settings.getUserSetting('idPersonal');
    this.BuscarAtenciones();
  }

  ObtenerConfiguracion(){
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

  pacientes: any[] = [];
  selectedPaciente: any; // Para almacenar el objeto seleccionado

  filterCountries(event: any) {
    const query = event.query;
    this.pacientes = this.comboPaciente.filter(s => s.nombre.toLowerCase().includes(query.toLowerCase()));
 
  }

  nuevoControl(event: any){
    this.modalRef = this.modalService.show(NuevoControlComponent, {backdrop: 'static', class: 'modal-xl'});
    //this.modalRef.content.
  }

  BuscarAtenciones() {
    this.criterioBusqueda = new CriterioBusquedaAtencionesObstetriciaDTO();
    this.textoCriterioBusqueda = "";
    let numeroDocumento = this.dataFormGroup.controls['inputNumeroDocumento'].value;
    if(this.selectedPaciente != null)
    {
      this.idPaciente = this.selectedPaciente.id
    }
    


    this.criterioBusqueda.idMedico = this.idMedico.toString();
    if (numeroDocumento != '' && numeroDocumento != null) {
      this.criterioBusqueda.numeroDocumento = numeroDocumento;
    }
    if (this.idPaciente != '' && this.idPaciente != null) {
      this.criterioBusqueda.idPaciente = this.idPaciente;
    }

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
      this.historiaService.ObtenerServicioConsulta(this.textoCriterioBusqueda)
        .subscribe({
          next: (data) => {
            if (data.length > 0) {
            console.log('data: ',data);
            this.listadoAtencionBusqueda = data.filter(s => s.idEspecialidad ==1);           
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
    this.idMedico = 0;*/
    this.idPaciente = ''; 
    this.listadoAtencionBusqueda = [];    
    /* this.comboPersonalMedico.forEach(element => {
      this.listaMedicos.push(element.medico);
    }); */
  }

  AbrirHistorial(idHistoriaClinica:number){

    this.modalRef = this.modalHistoria.show(HistorialObsteComponent, { backdrop: 'static', class: 'modal-xl'});
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica)
  }

  AbrirFuncionPaciente(idHistoriaClinica:number){

    this.modalRef = this.modalHistoria.show(FuncionVitalObsComponent, { backdrop: 'static', class: 'modal-xl'});
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica)
  }

  AbrirControlPreNatal(idHistoriaClinica:number){

    this.modalRef = this.modalHistoria.show(ControlPrenatalComponent, { backdrop: 'static', class: 'modal-xl'});
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica)
  }

  AbrirSeguimiento(idHistoriaClinica:number){

    this.modalRef = this.modalHistoria.show(SeguimientoAnalisisComponent, { backdrop: 'static', class: 'modal-xl'});
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica)
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
