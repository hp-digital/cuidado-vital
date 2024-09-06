import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { listaServiciosAgregadoDTO } from '../../../models/ListaServicioAgregadoDTO';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboDTO } from '../../../models/ComboDTO';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ServicioServiceService } from '../../../services/servicio.service.service';
import { PacienteService } from '../../../services/paciente.service';
import { PersonalService } from '../../../services/personal.service';
import { ListadoMedicoDTO } from '../../../models/ListadoMedicoDTO';
import { ServicioDTO } from '../../../models/ServicioDTO';
import moment from 'moment';
import { EstadoPacienteEnum } from '../../../enum/estadoPacienteEnum';
import { ModalidadPagoEnum } from '../../../enum/modalidadPagoEnum';
import { EstadoPagoEnum } from '../../../enum/estadoPagoEnum';

@Component({
  selector: 'app-registro-atencion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './registro-atencion.component.html',
  styleUrl: './registro-atencion.component.css'
})
export default class RegistroAtencionComponent implements OnInit{

  dataFormGroup: FormGroup;
  comboEspecialidad: ComboDTO[] = [];
  comboTipoAtencion: ComboDTO[] = [];
  comboListadoMedico: ListadoMedicoDTO[]=[];

  listaServiciosAgregados: listaServiciosAgregadoDTO[] = [];
  objServicio = new ServicioDTO();

  idPaciente:number=0;

  verSpinner: boolean = false;

  constructor(
    private modalRegistroAtencion: BsModalRef,
    private modalService: BsModalService,
    private servicioService: ServicioServiceService,
    private personalService: PersonalService
  ){
    this.dataFormGroup = new FormGroup({
      inputMotivoAtencion: new FormControl(),
      inputDniPaciente: new FormControl(),
      inputNombrePaciente: new FormControl(),
      selectEspecialidad: new FormControl(),
      selectMedico: new FormControl(),
      inputFechaInicio: new FormControl(),
      selectTipoAtencion: new FormControl(),
      inputIndicaciones: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.ObtenerDataInicio();
  }

  ObtenerDataInicio(){
    this.verSpinner = true;

    forkJoin([
      this.servicioService.ObtenerEspecialidad(),
      this.servicioService.ObtenerTipoAtencion(),
      this.personalService.ObtenerListadoMedico(),
    ])
    .subscribe(
      data =>{
        this.comboEspecialidad = data[0];
        this.comboTipoAtencion = data[1];
        this.comboListadoMedico = data[2];
      },

      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }
  AsignarIdPaciente(id: number, paciente: string,documento: string) {
 
    this.dataFormGroup.controls['inputNombrePaciente'].setValue(paciente);
    this.dataFormGroup.controls['inputDniPaciente'].setValue(documento);
    this.idPaciente = id;

    this.ObtenerDataInicio();
  }
  CerrarModal() {
    this.modalRegistroAtencion.hide();
    //this.onGuardar();
  }

  AgregarServicio(){
    let aLista = new listaServiciosAgregadoDTO();
      aLista.item = 1
      aLista.servicio = this.dataFormGroup.controls['inputMotivoAtencion'].value;
      this.listaServiciosAgregados.push(aLista);
  }
  Eliminar(id:number){

  }

  Guardar(){
    this.AsignarObjeto();
    this.verSpinner = true;
    console.log("obj guardar",this.objServicio)

    this.servicioService.Registrar(this.objServicio)
    .subscribe({
      next: (data) => {
        this.MostrarNotificacionSuccessModal('Se registró el servicio correctamente.', 'Éxito ');
        this.listaServiciosAgregados = [];
        let datos: any = data;
        console.log("data al registrar", datos);
      },
      error: (e) => {
        console.log(e);
        this.verSpinner = false;
        this.manejadorMensajeErroresGuardar(e);
      },
      complete: () => { this.verSpinner = false; }
    });
  }

  AsignarObjeto(){
    this.objServicio.idPaciente = this.idPaciente;
    this.objServicio.motivoAtencion = this.dataFormGroup.controls['inputMotivoAtencion'].value;
    this.objServicio.precio = 0;
    this.objServicio.idEspecialidad=this.dataFormGroup.controls['selectEspecialidad'].value;
    this.objServicio.idMedico= this.dataFormGroup.controls['selectMedico'].value;
    this.objServicio.fechaInicioAtencion = this.dataFormGroup.controls['inputFechaInicio'].value;
    //this.objServicio.fechaFinAtencion = '';
    this.objServicio.idEstadoPacienteServicio = EstadoPacienteEnum.EnAtencion;
    this.objServicio.indicaciones = this.dataFormGroup.controls['inputIndicaciones'].value;
    this.objServicio.idModalidadPago = ModalidadPagoEnum.Efectivo;
    this.objServicio.idEstadoPago = EstadoPagoEnum.Pendiente;
    this.objServicio.idTipoAtencion = this.dataFormGroup.controls['selectTipoAtencion'].value;
    this.objServicio.estado =true;
    this.objServicio.usuarioCreacion = 'admin';
    this.objServicio.usuarioModificacion = 'admin';
    this.objServicio.fechaCreacion = moment().toDate();
    this.objServicio.fechaModificacion=moment().toDate();
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
  manejadorMensajeErroresGuardar(e: any) {
    if (typeof e != "string") {
      let error = e;
      let arrayErrores: any[] = [];
      let errorValidacion = Object.keys(e);
      if (Array.isArray(errorValidacion)) {
        errorValidacion.forEach((propiedadConError: any) => {
          error[propiedadConError].forEach((mensajeError: any) => {
            if (!arrayErrores.includes(mensajeError['mensaje'])) {
              arrayErrores.push(mensajeError['mensaje']);
            }
          });
        });
        this.MostrarNotificacionError(arrayErrores.join("<br/>"), '¡ERROR EN EL PROCESO!')
      } else {
        this.MostrarNotificacionError("", '¡ERROR EN EL PROCESO!')
      }
    }
    else {
      this.MostrarNotificacionError(e, '¡ERROR EN EL PROCESO!');
    }
  }
}
