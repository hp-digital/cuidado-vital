import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import  CuadroControlesComponent  from '../cuadro-controles/cuadro-controles.component';
import { RecetaComponent } from '../receta/receta.component';
import { ExamenAuxiliarComponent } from '../examen-auxiliar/examen-auxiliar.component';
import { ConsultaExternaComponent } from '../historia-clinica/consulta-externa/consulta-externa.component';
import { SettingsService } from '../../services/settings.service';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';
import { ComboDTO } from '../../models/ComboDTO';
import { CriterioBusquedaAtencionesDTO } from '../../models/CriterioBusquedaAtencionesDTO';
import { ListadoBusquedaAtencionDTO } from '../../models/ListadoBusquedaAtencionDTO';
import { HistoriaService } from '../../services/historia.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NuevoControlComponent } from './nuevo-control/nuevo-control.component';
import { CuadroControlesReportesComponent } from '../cuadro-controles-reportes/cuadro-controles-reportes.component';
import { ControlGeneralComponent } from '../historia-clinica/control-general/control-general.component';
import { FuncionesVitalesComponent } from '../funciones-vitales/funciones-vitales.component';
import { MonitoreoComponent } from '../monitoreo/monitoreo.component';
import { ChatComponent } from '../chat/chat.component';
import { CuadroControlNotaComponent } from '../cuadro-control-nota/cuadro-control-nota.component';
import { CuadroControlEnfermeraComponent } from '../cuadro-control-enfermera/cuadro-control-enfermera.component';
import { HistorialClinicoComponent } from '../historia-clinica/historial-clinico/historial-clinico.component';
import { MonitoreoGeneralComponent } from './monitoreo-general/monitoreo-general.component';

@Component({
  selector: 'app-atenciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,AutoCompleteModule,CalendarModule, InputTextModule],
  templateUrl: './atenciones.component.html',
  styleUrl: './atenciones.component.css',
  providers: [BsModalService],
})
export default class AtencionesComponent implements OnInit{

  dataFormGroup: FormGroup;
  verSpinner:boolean = false;
  idRol: number=0;
  idMedico: number=0;

  comboPaciente:ComboDTO[]=[];

  criterioBusqueda = new CriterioBusquedaAtencionesDTO();
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
    private modalControles: BsModalService,
    private modalControlesReportes: BsModalService,
    private modalReceta: BsModalService,
    private modalExamenAuxiliar: BsModalService,
    private modalControlSeguimiento: BsModalService,
    private modalNuevoRegistro: BsModalService,
    private modalControlGeneral: BsModalService,
    private modalDatoPulsera: BsModalService,
    private modalMonitoreoCamara: BsModalService,
    private modalChat: BsModalService,
    private modalControlNotasEnfermera: BsModalService,
    private modalMonitoreoGeneral: BsModalService,
    private settings : SettingsService,
    private pacienteService : PacienteService,
    private historiaService: HistoriaService
  ){
    this.dataFormGroup = new FormGroup({
      inputNumeroDocumento: new FormControl(),
      inputPaciente: new FormControl(),
      inputFechaInicio: new FormControl(),
      inputFechaFin: new FormControl()
      
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
    this.criterioBusqueda = new CriterioBusquedaAtencionesDTO();
    this.textoCriterioBusqueda = "";
    let numeroDocumento = this.dataFormGroup.controls['inputNumeroDocumento'].value;
    if(this.selectedPaciente != null)
    {
      this.idPaciente = this.selectedPaciente.id
    }
    
    let fechaInicio = this.fechaInicio?.toString();


    this.criterioBusqueda.idMedico = this.idMedico.toString();
    if (numeroDocumento != '' && numeroDocumento != null) {
      this.criterioBusqueda.numeroDocumento = numeroDocumento;
    }
    if (this.idPaciente != '' && this.idPaciente != null) {
      this.criterioBusqueda.idPaciente = this.idPaciente;
    }

    if (fechaInicio != '' && fechaInicio != null)
      this.criterioBusqueda.fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');

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
            if(this.idRol==1){
              this.listadoAtencionBusqueda = data.filter(s => s.idEspecialidad !=1 && s.idMedico==this.idMedico); 
            }else {
              this.listadoAtencionBusqueda = data.filter(s => s.idEspecialidad !=11);
            }
                      
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

  AbrirPdf(idHistoria:number){

    this.historiaService.ObtenerHistoriaClinica(idHistoria)
    .subscribe(
      data => {
        console.log("hcl", data);
        this.AsignarPdf(data);

        this.verSpinner = false;
      },
      err => {
        this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
        this.verSpinner = false;
      }
    );

  }

  AsignarPdf(data:any){
    let objHistoria: any = data;

    let url = objHistoria.historiaExterna.urlPdfHistoriaClinica;
    if(url != " ")
      {window.open(url, "_blank");}
    else{
      this.MostrarNotificacionError("No se encuentra el PDF de la Historia Clinica", "Error")
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

  AbrirHistoria(idHistoriaClinica:number, idTipoOrigen: number) {
    
    if(idTipoOrigen==1)
    {
      this.modalRef = this.modalControlGeneral.show(HistorialClinicoComponent, { backdrop: 'static', class: 'modal-xl'});
      this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
    }
    if(idTipoOrigen==2)
    {
      this.modalRef = this.modalService.show(HistoriaClinicaComponent, { backdrop: 'static', class: 'modal-xl' });
      this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
        /* this.modalRef.content.onGuardar = () => {
          this.obtenerHistoriaClinica(idHistoriaClinica);
        }; */
    }
  
  }

  AbrirControles(idHistoriaClinica:number, idEspecialidad:number){
    this.modalControlesRef = this.modalControles.show(CuadroControlesComponent, { backdrop: 'static', class: 'modal-xg' });
    this.modalControlesRef.content.AsignarHistoriaClinica(idHistoriaClinica, idEspecialidad);
    
  }

  AbrirControlesReporte(idHistoriaClinica:number, idEspecialidad:number){
    this.modalRef = this.modalControlesReportes.show(CuadroControlesReportesComponent, {backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica, idEspecialidad);
  }

  AbrirControlesReporteEnfermera(idHistoriaClinica:number){
    this.modalRef = this.modalControlesReportes.show(CuadroControlEnfermeraComponent, {backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirControlesNotasEnfermera(idHistoriaClinica:number){
    this.modalRef = this.modalControlNotasEnfermera.show(CuadroControlNotaComponent, { backdrop: 'static', class: 'modal-xg' })
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirRecetas(idHistoriaClinica:number){
    this.modalRef = this.modalReceta.show(RecetaComponent, { backdrop: 'static', class: 'modal-xl' })
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }

  AbrirExamenAuxiliar(idHistoriaClinica:number){
    this.modalRef = this.modalExamenAuxiliar.show(ExamenAuxiliarComponent, { backdrop: 'static', class: 'modal-xl' })
    this.modalRef.content.AsignarObjetoListaPaciente(idHistoriaClinica);
  }

  AbrirDatosPulsera(idHistoriaClinica: number){
    this.modalRef = this.modalDatoPulsera.show(FuncionesVitalesComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirMonitoreoCamara(idHistoriaClinica:number){
    this.modalRef = this.modalMonitoreoCamara.show(MonitoreoComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirControlSeguimiento(){
    this.modalRef = this.modalControlSeguimiento.show(ConsultaExternaComponent, { backdrop: 'static', class: 'modal-xl' })
  }

  AbrirChat(idHistoriaClinica: number){
    this.modalRef = this.modalChat.show(ChatComponent, { backdrop: 'static', class: 'modal-xg'})
    this.modalRef.content.AsignarHistoriaClinica(idHistoriaClinica);
  }

  AbrirMonitoreoGeneral(idHistoriaClinica : number)
  {
    this.modalRef = this.modalMonitoreoGeneral.show(MonitoreoGeneralComponent, { backdrop: 'static', class: 'modal-xl'})
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
