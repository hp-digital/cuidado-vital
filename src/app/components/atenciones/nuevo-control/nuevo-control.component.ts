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


  verificarBusqueda: boolean = false;
  verificarBusquedaTipoDocumento: boolean = false;

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
      inputBuscarPorTipoDocumento: new FormControl(),
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
    let idTipoDocumento = this.dataFormGroup.controls['inputBuscarPorTipoDocumento'].value;
    let nroDocumento = this.dataFormGroup.controls['inputDocumentoBusqueda'].value;
    if(nroDocumento != "" && idTipoDocumento != "" && idTipoDocumento != null)
    {
      this.verSpinner = true;
      this.verificarBusqueda = false;
      this.verificarBusquedaTipoDocumento = false;
      this.pacienteService.ObtenerPacientePorNroDocumento(nroDocumento)
        .subscribe({
          next: (data) => {
            //console.log(data) ;
            if(data == null)
            {
              if (idTipoDocumento == 1) {
                this.ConsultarAPI(nroDocumento);
              }
              else {
                this.MostrarNotificacionWarning('Verificar si el tipo y número documento son correctos.', '¡No se encontró los datos!')
              }
            }else{
              this.Paciente = data;
              this.MostrarDatos(data);
              console.log(this.Paciente);

              const n = data.fechaNacimiento;
              console.log(n)
              /* var y = n.getFullYear();
              var m = n.getMonth() + 1;
              var d = n.getDate();
              this.dataFormGroup.controls['inputFechaNacimientoPaciente'].setValue(d+"/"+m+"/"+y); */
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
    else{
      if (nroDocumento == "" || nroDocumento == null)
        this.verificarBusqueda = true;
      else
        this.verificarBusqueda = false;

      if (idTipoDocumento == "" || idTipoDocumento == null)
        this.verificarBusquedaTipoDocumento = true;
      else
        this.verificarBusquedaTipoDocumento = false;
    
    }
    
  }

  ConsultarAPI(nroDocumento: string) {
   /*  this.verSpinner = true;
    this.pacienteService.ObtenerPacientePorAPIv2(nroDocumento)
      .subscribe({
        next: (persona) => {
          console.log('data endpoint', persona);
          if (persona.resultadoEncontrado) {
            this.dataFormGroup.controls['inputNroDocumento'].setValue(persona.numero);
            this.dataFormGroup.controls['inputApellidoPaterno'].setValue(persona.apellidoPaterno);
            this.dataFormGroup.controls['inputApellidoMaterno'].setValue(persona.apellidoMaterno);
            this.dataFormGroup.controls['inputNombres'].setValue(persona.nombres);
            this.dataFormGroup.controls['selectTipoDocumento'].setValue(TipoDocumentoEnum.DNI);
            if (persona.fechaNacimiento != null && persona.fechaNacimiento != '') {
              this.dataFormGroup.controls['inputFechaNacimiento'].setValue(moment(persona.fechaNacimiento, 'DD-MM-YYYY').format('YYYY-MM-DD'));
            }
            if (persona.direccion != null && persona.direccion != '') {
              this.dataFormGroup.controls['inputDireccion'].setValue(persona.direccion);
            }
            if (persona.sexo != null && persona.sexo != '') {
              if (persona.sexo == 'Masculino') {
                this.dataFormGroup.controls['inputSexo'].setValue(SexoEnum.Masculino);
              }
              if (persona.sexo == 'Femenino') {
                this.dataFormGroup.controls['inputSexo'].setValue(SexoEnum.Femenino);
              }
            }
            if (persona.estadoCivil != null && persona.estadoCivil != '') {
              if (persona.estadoCivil == 'Soltero' || persona.estadoCivil == 'Soltera') {
                this.dataFormGroup.controls['selectEstadoCivil'].setValue(1);
              }
              if (persona.estadoCivil == 'Casado' || persona.estadoCivil == 'Casada') {
                this.dataFormGroup.controls['selectEstadoCivil'].setValue(2);
              }
              if (persona.estadoCivil == 'Viudo' || persona.estadoCivil == 'Viuda') {
                this.dataFormGroup.controls['selectEstadoCivil'].setValue(3);
              }
              if (persona.estadoCivil == 'Conviviente') {
                this.dataFormGroup.controls['selectEstadoCivil'].setValue(4);
              }
              if (persona.estadoCivil == 'Divorciado' || persona.estadoCivil == 'Divorciada') {
                this.dataFormGroup.controls['selectEstadoCivil'].setValue(5);
              }
            }
            if (persona.departamento != null && persona.departamento != '') {
              this.dataFormGroup.controls['selectPaisDireccion'].setValue(1);
              let departamento = persona.departamento;
              let nombreDepartamento = this.listaDepartamento.filter(x => this.removerTilde(x.nombre.toUpperCase()) == departamento)[0].id;
              this.dataFormGroup.controls['selectDepartamentoDireccion'].setValue(nombreDepartamento);
            }
            if (persona.provincia != null && persona.provincia != '') {
              let provincia = persona.provincia;
              let nombreProvincia = this.listaProvincia.filter(x => this.removerTilde(x.nombre.toUpperCase()) == provincia)[0].id;
              this.dataFormGroup.controls['selectProvinciaDireccion'].setValue(nombreProvincia);
            }
            if (persona.distrito != null && persona.distrito != '') {
              let distrito = persona.distrito;
              let nombreDistrito = this.listaDistrito.filter(x => this.removerTilde(x.nombre.toUpperCase()) == distrito)[0].id;
              this.dataFormGroup.controls['selectDistritoDireccion'].setValue(nombreDistrito);
            }
            this.pacienteBuscado = true;
          }
          else {
            this.MostrarNotificacionWarning('Registrarlo como nuevo.', '¡No se encontró los datos!')
          }
        },
        error: (e) => {
          this.verSpinner = false;
          console.log(e);
          this.MostrarNotificacionError('Por favor intente de nuevo, si el problema persiste, comunicarse con el área de sistemas.', '¡ERROR EN EL PROCESO!');
        },
        complete: () => { this.verSpinner = false; }
      }); */
  }

  MostrarDatos(paciente:any){
    this.dataFormGroup.controls['selectRegistrarPorTipoDocumento'].setValue(paciente['idTipoDocumento']);
    this.dataFormGroup.controls['inputNumeroDocumento'].setValue(paciente['numeroDocumento']);
    this.dataFormGroup.controls['inputApellidoPaternoPaciente'].setValue(paciente['apellidoPaterno']);
    this.dataFormGroup.controls['inputApellidoMaternoPaciente'].setValue(paciente['apellidoMaterno']);
    this.dataFormGroup.controls['inputNombrePaciente'].setValue(paciente['nombres']);
    
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
