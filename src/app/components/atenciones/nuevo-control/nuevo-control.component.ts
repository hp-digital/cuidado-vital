import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboDTO } from '@models/ComboDTO';
import { PacienteDTO } from '@models/paciente';
import { PacienteService } from '@services/paciente.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import  moment from 'moment';
import { RegistroNuevaAtencionPacienteDTO } from '@models/registro-paciente-nueva-atencion';
import { SettingsService } from '@services/settings.service';
import { ServicioServiceService } from '@services/servicio.service.service';

@Component({
  selector: 'app-nuevo-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './nuevo-control.component.html',
  styleUrl: './nuevo-control.component.css'
})
export class NuevoControlComponent implements OnInit{

  dataFormGroup: FormGroup;
  comboTipoDocumento: ComboDTO[] = [];
  comboEstadoCivil : ComboDTO[] = [];
  comboSexo: ComboDTO[] = [];
  comboEspecialidad: ComboDTO[]=[];

  Paciente = new PacienteDTO();
  idPaciente:number=0;
  usuario:string='';

  objNuevaAtencion = new RegistroNuevaAtencionPacienteDTO();

  verSpinner: boolean = false;
  constructor(
    private modalNuevoControl: BsModalRef,
    private modalService: BsModalService,
    private pacienteService: PacienteService,
    private settingsService: SettingsService,
    private servicioService: ServicioServiceService
  ){
    this.dataFormGroup = new FormGroup({
      inputMotivoAtencion: new FormControl(),
      inputDocumentoBusqueda: new FormControl(),
      inputFechaIngreso: new FormControl(),
      selectEspecialidad: new FormControl(),
      selectRegistrarPorTipoDocumento: new FormControl(),
      inputNumeroDocumento: new FormControl(),
      inputApellidoPaternoPaciente: new FormControl(),
      inputApellidoMaternoPaciente: new FormControl(),
      inputNombrePaciente: new FormControl(),
      inputFechaNacimientoPaciente: new FormControl(),
      inputEdadPaciente: new FormControl(),
      inputSexoPaciente: new FormControl(),
      inputTelefonoPaciente: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();
    this.usuario =  this.settingsService.getUserSetting('usuario');
    this.dataFormGroup.controls['inputFechaIngreso'].setValue(moment().format('DD/MM/YYYY'));
  }

  CargarDataInicio(){
    this.verSpinner = true;
    forkJoin([
      this.pacienteService.ObtenerTipoDocumento(),
      this.pacienteService.ObtenerEstadoCivil(),
      this.pacienteService.ObtenerSexo(),
      this.pacienteService.ObtenerEspecialidadMedica()
      
    ])
    .subscribe(
      data =>{
        this.comboTipoDocumento = data[0];
        this.comboEstadoCivil = data[1];
        this.comboSexo = data[2];
        this.comboEspecialidad = data[3];

        this.verSpinner = false;
        ;
      },
      
      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }

  BuscarPacienteDNI(){
    let nroDocumento = this.dataFormGroup.controls['inputDocumentoBusqueda'].value;
    this.verSpinner = true;
    this.pacienteService.ObtenerPacientePorNroDocumento(nroDocumento)
      .subscribe({
        next: (data) => {
          //console.log(data) ;
          if(data == null)
          {
            this.MostrarNotificacionWarning('Paciente no registrado previamente. Registre los datos manualmente', 'Atención');
          }else{
            this.Paciente = data;
            this.MostrarDatos(data);
            console.log(this.Paciente);
          }

        },
        error: (e) => {
          console.log(e);
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN BUSCAR AL PACIENTE!')
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      })
  }

  MostrarDatos(paciente:any){
    this.dataFormGroup.controls['selectRegistrarPorTipoDocumento'].setValue(paciente['idTipoDocumento']);
    this.dataFormGroup.controls['inputNumeroDocumento'].setValue(paciente['numeroDocumento']);
    this.dataFormGroup.controls['inputApellidoPaternoPaciente'].setValue(paciente['apellidoPaterno']);
    this.dataFormGroup.controls['inputApellidoMaternoPaciente'].setValue(paciente['apellidoMaterno']);
    this.dataFormGroup.controls['inputNombrePaciente'].setValue(paciente['nombres']);
    this.dataFormGroup.controls['inputFechaNacimientoPaciente'].setValue(paciente['fechaNacimiento']);
    this.dataFormGroup.controls['inputSexoPaciente'].setValue(paciente['idSexo']);
    this.dataFormGroup.controls['inputTelefonoPaciente'].setValue(paciente['numeroCelular']);
    this.idPaciente=paciente['id'];
    this.CalcularEdad(paciente['fechaNacimiento']);
  }

  Guardar(){
    this.AsignarObjetosGuardar();
    this.verSpinner = true;

    console.log("a guardar", this.objNuevaAtencion);

    this.servicioService.RegistrarNuevaAtencion(this.objNuevaAtencion)
    .subscribe({
      next: (data) => {
        this.MostrarNotificacionSuccessModal('Se registró la atención correctamente.', 'Éxito ');
        //this.listaServiciosAgregados = [];
        let datos: any = data;
        console.log("data al registrar", datos);
        this.CerrarModal();
      },
      error: (e) => {
        console.log(e);
        this.verSpinner = false;
        this.manejadorMensajeErroresGuardar(e);
      },
      complete: () => { this.verSpinner = false; }
    });
  }

  AsignarObjetosGuardar(){
    
    this.objNuevaAtencion.idPaciente = this.idPaciente;
    this.objNuevaAtencion.numeroDocumento = this.dataFormGroup.controls['inputNumeroDocumento'].value;
    this.objNuevaAtencion.tipoDocumento = this.dataFormGroup.controls['selectRegistrarPorTipoDocumento'].value; 
    this.objNuevaAtencion.apellidoPaterno = this.dataFormGroup.controls['inputApellidoPaternoPaciente'].value;
    this.objNuevaAtencion.apellidoMaterno = this.dataFormGroup.controls['inputApellidoMaternoPaciente'].value;
    this.objNuevaAtencion.nombres = this.dataFormGroup.controls['inputNombrePaciente'].value;
    this.objNuevaAtencion.fechaNacimiento = this.dataFormGroup.controls['inputFechaNacimientoPaciente'].value;
    this.objNuevaAtencion.sexo = this.dataFormGroup.controls['inputSexoPaciente'].value;
    this.objNuevaAtencion.celular = this.dataFormGroup.controls['inputTelefonoPaciente'].value;
    this.objNuevaAtencion.idMedico = 13;//this.dataFormGroup.controls[''].value;
    this.objNuevaAtencion.fechaInicioAtencion = new Date();
    this.objNuevaAtencion.idEspecialidad = this.dataFormGroup.controls['selectEspecialidad'].value;
    this.objNuevaAtencion.estado = true;
    this.objNuevaAtencion.usuarioCreacion = this.usuario;
    this.objNuevaAtencion.usuarioModificacion = this.usuario;
    this.objNuevaAtencion.fechaCreacion = new Date();
    this.objNuevaAtencion.fechaModificacion = new Date();
  }

  ValidarEdad(){
    let fecha = this.dataFormGroup.controls['inputFechaNacimientoPaciente'].value;
    this.CalcularEdad(fecha);
  }

  CalcularEdad(fecha:Date){
    let anios = 0;
    
    let nacimiento = (fecha);
    var hoy = moment( new Date());
    anios = hoy.diff(nacimiento, "years");
    
    this.dataFormGroup.controls['inputEdadPaciente'].setValue(anios);

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

  CerrarModal() {
    this.modalNuevoControl.hide();
    //this.onGuardar();
  }
}
