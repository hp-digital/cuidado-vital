import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComboDTO } from '@models/ComboDTO';
import { DepartamentoDTO } from '@models/DepartamentoDTO';
import { ProvinciaDTO } from '@models/ProvinciaDTO';
import { DistritoDTO } from '@models/DistritoDTO';
import { MedicoDTO } from '@models/MedicoDTO';
import { ValoresDefectoCamposEnum } from '@enum/ValoresDefectoCamposEnum';
import { PacienteService } from '@services/paciente.service';
import { PersonalService } from '@services/personal.service';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-registro-medico',
  standalone: true,
  templateUrl: './registro-medico.component.html',
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    CalendarModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
  ],
  styles: [`
      :host ::ng-deep ul{
          padding-left:0 !important;
          margin-bottom: 0;
          padding-bottom: 0;
        }
      :host ::ng-deep th{
        border: none;
      }
      :host ::ng-deep .p-autocomplete-multiple-container{
        width:100% 
      }
  `],
})

export class RegistroMedicoComponent implements OnInit {

  inputFechaNacimiento: Date | undefined;
  items: any[] | undefined;
  autocompleteEspecialidadMedica: any;
  filteredEspecialidad: any[] = [];
  dataFormGroup: FormGroup;
  comboTipoDocumento: ComboDTO[] = [];
  comboEspecialidades: ComboDTO[] = [];
  comboSexo: ComboDTO[] = [];
  comboPais: ComboDTO[] = [];
  comboDepartamento: ComboDTO[] = [];
  comboProvincia: ComboDTO[] = [];
  comboDistrito: ComboDTO[] = [];
  listaDepartamento: DepartamentoDTO[] = [];
  listaProvincia: ProvinciaDTO[] = [];
  listaDistrito: DistritoDTO[] = [];
  verSpinner: boolean = false;
  disabledUbigeo: boolean = false;
  idMedico: number = 0;
  idProfesion: number = 1;
  idRol: number = 1;
  objMedico = new MedicoDTO();
  usuario: string = "";
  usuarioCreacion: string = "";
  fechaCreacion: Date | undefined;

  constructor(
    private bsModalRegistroMedico: BsModalRef,
    private bsModalRef: BsModalRef,
    private messageService: MessageService,
    private pacienteService: PacienteService,
    private personalService: PersonalService

  ) {
    this.dataFormGroup = new FormGroup({
      selectTipoDocumento: new FormControl('', [Validators.required]),
      inputNroDocumento: new FormControl('', [Validators.required, Validators.minLength(8)]),
      inputApellidoPaterno: new FormControl('', [Validators.required]),
      inputApellidoMaterno: new FormControl('', [Validators.required]),
      inputNombres: new FormControl('', [Validators.required]),
      inputFechaNacimiento: new FormControl('', [Validators.required]),
      inputEdadPersona: new FormControl(''),
      inputTelefonoCelular: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]),
      inputSexo: new FormControl('', [Validators.required]),
      inputDireccion: new FormControl('', [Validators.required]),
      inputCorreoElectronico: new FormControl(),
      inputCMP: new FormControl(''),
      inputRNE: new FormControl(''),
      autocompleteEspecialidadMedica: new FormControl(),
      selectPaisDireccion: new FormControl('', [Validators.required]),
      selectDepartamentoDireccion: new FormControl('', [Validators.required]),
      selectProvinciaDireccion: new FormControl('', [Validators.required]),
      selectDistritoDireccion: new FormControl('', [Validators.required]),
      // fileImagenPerfil: new FormControl(''),
      // fileImagenFirma: new FormControl(''),

    });
  };

  ngOnInit(): void {
    this.CargarDataInicio();

    console.log(this.dataFormGroup.controls);
  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
      this.pacienteService.ObtenerTipoDocumento(),
      this.pacienteService.ObtenerEspecialidadMedica(),
      this.pacienteService.ObtenerSexo(),
    ])
      .subscribe(
        data => {
          this.comboTipoDocumento = data[0];
          this.comboEspecialidades = data[1];
          this.comboSexo = data[2];
          this.comboPais = JSON.parse(localStorage.getItem('Paises')!);
          this.listaDepartamento = JSON.parse(localStorage.getItem('Departamento')!);
          this.listaProvincia = JSON.parse(localStorage.getItem('Provincia')!);
          this.listaDistrito = JSON.parse(localStorage.getItem('Distrito')!);
        },
        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      )
  }


  CerrarModal() {
    this.bsModalRegistroMedico.hide();
  }

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se subió el archivo con éxito' });
  }

  search(event: AutoCompleteCompleteEvent) {
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

  MostrarNotificacionError(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
  }


  MostrarNotificacionSuccessModal(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }

  // MostrarNotificacionSuccess(mensaje: string, titulo: string) {
  //   Swal.fire({
  //     icon: 'success',
  //     title: titulo,
  //     text: mensaje,
  //     showDenyButton: false,
  //     showCancelButton: false,
  //     confirmButtonText: 'Ok',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Object.keys(this.dataFormGroup.controls).forEach(control => {
  //         this.dataFormGroup.controls[control].markAsPristine();
  //       });
  //       this.contador = this.contadorInicial;
  //       this.verBotonesExtras = true;
  //       this.bsModalRef.hide();
  //       /* modificaco por paul suarez*/
  //       this.bsModalRef = this.modalService.show(ConsultaCitaComponent, { backdrop: 'static', class: 'modal-xl' });
  //       this.bsModalRef.content.AsignarIdPaciente(
  //         this.idPaciente,
  //         this.objPaciente.NumeroDocumento,
  //         this.objPaciente.ApellidoPaterno,
  //         this.objPaciente.ApellidoMaterno,
  //         this.objPaciente.Nombres,
  //       );
  //       this.bsModalRef.content.AsignarParametrosInterconsulta(this.fechaInterconsulta, this.medicoInterconsulta, this.especialidadInterconsulta);
  //       this.bsModalRef.content.onGuardar = () => { };
  //       /*Fin de la modificacion*/

  //     }
  //   })
  // }

  listarDepartamentos(e: any) {
    console.log('Id país: ', e.value);
    this.comboDepartamento = [];
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idPais = e.value;
    if (idPais == ValoresDefectoCamposEnum.Pais) {
      this.comboDepartamento = this.pacienteService.ObtenerDepartamentos(e.value);
      this.ActivarValidacionesUbigeo();
      this.disabledUbigeo = false;
    }
    else {
      this.disabledUbigeo = true;
      this.DesactivarValidacionesUbigeo();
    }

    this.dataFormGroup.controls['selectDepartamentoDireccion'].setValue('');
    this.dataFormGroup.controls['selectProvinciaDireccion'].setValue('');
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
    this.ListarDepartamentos();
  }
  listarProvincias(e: any) {
    this.comboProvincia = [];
    this.comboDistrito = [];
    this.comboProvincia = this.pacienteService.ObtenerProvincias(e.value);
    this.dataFormGroup.controls['selectProvinciaDireccion'].setValue('');
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
    this.ListarProvincias();
  }
  listarDistritos(e: any) {
    this.comboDistrito = [];
    this.comboDistrito = this.pacienteService.ObtenerDistritos(e.value);
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
    this.ListarDistritos();
  }
  ActivarValidacionesUbigeo() {
    this.dataFormGroup.get('selectDepartamentoDireccion')?.setValidators([Validators.required]);
    this.dataFormGroup.get('selectDepartamentoDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectProvinciaDireccion')?.setValidators([Validators.required]);
    this.dataFormGroup.get('selectProvinciaDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectDistritoDireccion')?.setValidators([Validators.required]);
    this.dataFormGroup.get('selectDistritoDireccion')?.updateValueAndValidity();
  }
  DesactivarValidacionesUbigeo() {
    this.dataFormGroup.get('selectDepartamentoDireccion')?.clearValidators();
    this.dataFormGroup.get('selectDepartamentoDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectProvinciaDireccion')?.clearValidators();
    this.dataFormGroup.get('selectProvinciaDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectDistritoDireccion')?.clearValidators();
    this.dataFormGroup.get('selectDistritoDireccion')?.updateValueAndValidity();
  }
  ListarDepartamentos() {
    this.comboDepartamento = [];
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idPais = this.dataFormGroup.controls['selectPaisDireccion'].value;
    this.comboDepartamento = this.pacienteService.ObtenerDepartamentos(idPais);
    console.log('dptos: ', this.comboDepartamento);
  }
  ListarProvincias() {
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idDepartamento = this.dataFormGroup.controls['selectDepartamentoDireccion'].value;
    this.comboProvincia = this.pacienteService.ObtenerProvincias(idDepartamento);
  }
  ListarDistritos() {
    this.comboDistrito = [];
    let idProvincia = this.dataFormGroup.controls['selectProvinciaDireccion'].value;
    this.comboDistrito = this.pacienteService.ObtenerDistritos(idProvincia);
  }

  EdadPaciente(e: any) {
    let fecha = "";
    fecha = this.dataFormGroup.controls['inputFechaNacimiento'].value;
    this.CalcularEdadPaciente(new Date(fecha).toISOString());
    console.log('fecha: ', fecha);
  }

  CalcularEdadPaciente(fechaNacimiento: string) {
    let anios = 0;
    //let validarFormatoFecha = /^(0[1-9]|[1-2]\d|3[01])(\/)(0[1-9]|1[012])\2(\d{4})$/;
    let nacimiento = (fechaNacimiento);
    var hoy = moment();
    anios = hoy.diff(nacimiento, "years");
    this.dataFormGroup.controls['inputEdadPersona'].setValue(anios);
  }

  buscarControlesInvalidos() {
    const invalid = [];
    const controls = this.dataFormGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        let element: any = document.querySelector('[formcontrolname="' + name + '"]');
        element.scrollIntoView();
        break;
      }
    }
    return invalid;
  }

  Guardar() {
    let idPais = this.dataFormGroup.controls['selectPaisDireccion'].value;
    if (idPais == ValoresDefectoCamposEnum.Pais) {
      this.ActivarValidacionesUbigeo();
    }
    else {
      this.DesactivarValidacionesUbigeo();
    }
    for (let c in this.dataFormGroup.controls) {
      this.dataFormGroup.controls[c].markAsTouched();
    }
    console.log('form: ', this.dataFormGroup);
    if (this.dataFormGroup.valid) {
      this.AsignarValoresAObjeto();
      if (this.idMedico != 0) {
        this.Modificar();
      }
      else {
        this.Insertar();
      }
    } else {
      this.buscarControlesInvalidos();
      this.MostrarNotificacionError('Falta validar campos.', '¡ERROR EN EL PROCESO!');
    }
  }

  AsignarValoresAObjeto() {
    let today = new Date();
    let numeroCelular = "";
    if (this.dataFormGroup.controls['inputTelefonoCelular'].value != null) {
      numeroCelular = this.dataFormGroup.controls['inputTelefonoCelular'].value;
    }
    this.objMedico = new MedicoDTO();
    this.objMedico.Id = this.idMedico;
    this.objMedico.NumeroDocumento = this.dataFormGroup.controls['inputNroDocumento'].value;
    this.objMedico.ApellidoPaterno = (this.dataFormGroup.controls['inputApellidoPaterno'].value != '' ? this.dataFormGroup.controls['inputApellidoPaterno'].value : ValoresDefectoCamposEnum.ApellidoPaterno);
    this.objMedico.ApellidoMaterno = this.dataFormGroup.controls['inputApellidoMaterno'].value;
    this.objMedico.Nombres = (this.dataFormGroup.controls['inputNombres'].value != '' ? this.dataFormGroup.controls['inputNombres'].value : ValoresDefectoCamposEnum.Nombres);
    this.objMedico.FechaNacimiento = (this.dataFormGroup.controls['inputFechaNacimiento'].value != '' ? new Date(this.dataFormGroup.controls['inputFechaNacimiento'].value).toISOString() : new Date(ValoresDefectoCamposEnum.FechaNacimiento).toISOString());
    this.objMedico.Celular = numeroCelular;
    this.objMedico.Email = (this.dataFormGroup.controls['inputCorreoElectronico'].value != '' ? this.dataFormGroup.controls['inputCorreoElectronico'].value : ValoresDefectoCamposEnum.Email);
    this.objMedico.Direccion = this.dataFormGroup.controls['inputDireccion'].value;
    this.objMedico.NroColegiatura = this.dataFormGroup.controls['inputDireccion'].value;
    this.objMedico.Rne = this.dataFormGroup.controls['inputDireccion'].value;
    this.objMedico.Estado = true;

    if (this.idMedico == 0) {
      this.objMedico.UsuarioCreacion = this.usuario;
      this.objMedico.UsuarioModificacion = this.usuario;
      this.objMedico.FechaCreacion = today;
      this.objMedico.FechaModificacion = today;
    }
    else {
      this.objMedico.UsuarioCreacion = this.usuarioCreacion;
      this.objMedico.UsuarioModificacion = this.usuario;
      this.objMedico.FechaCreacion = this.fechaCreacion;
      this.objMedico.FechaModificacion = today;
    }
    this.objMedico.IdTipoDocumento = this.dataFormGroup.controls['selectTipoDocumento'].value;
    this.objMedico.IdSexo = (this.dataFormGroup.controls['inputSexo'].value != '' ? this.dataFormGroup.controls['inputSexo'].value : ValoresDefectoCamposEnum.Sexo);
    this.objMedico.IdPais = (this.dataFormGroup.controls['selectPaisDireccion'].value != '' ? this.dataFormGroup.controls['selectPaisDireccion'].value : ValoresDefectoCamposEnum.Pais);
    this.objMedico.IdDepartamento = (this.dataFormGroup.controls['selectDepartamentoDireccion'].value != '' ? this.dataFormGroup.controls['selectDepartamentoDireccion'].value : ValoresDefectoCamposEnum.Departamento);
    this.objMedico.IdProvincia = (this.dataFormGroup.controls['selectProvinciaDireccion'].value != '' ? this.dataFormGroup.controls['selectProvinciaDireccion'].value : ValoresDefectoCamposEnum.Provincia);
    this.objMedico.IdDistrito = (this.dataFormGroup.controls['selectDistritoDireccion'].value != '' ? this.dataFormGroup.controls['selectDistritoDireccion'].value : ValoresDefectoCamposEnum.Distrito);
    this.objMedico.IdRol = this.idRol;
    this.objMedico.IdProfesion = this.idProfesion;
    console.log(this.objMedico);

  }

  Modificar() {
    /* this.verSpinner = true;
    this.pacienteService.Modificar(this.objPaciente)
      .subscribe({
        next: (data: any) => {
          if(data!=false){
            let id: any = data;
            this.idPaciente = id;
            this.MostrarNotificacionSuccess('El proceso se realizó con éxito.', '');
            this.bsModalRef.content.onGuardar = () => { };            
          }
          else{            
            this.sinAperturaCaja  = true;
            this.MostrarNotificacionError('Debe aperturar una caja para continuar.','¡Apertura de caja no valida!');
          } 
        },
        error: (e: any) => {
          this.verSpinner = false;
          this.manejadorMensajeErroresGuardar(e);
        },
        complete: () => { this.verSpinner = false; }
      }); */
  }

  Insertar() {
    this.verSpinner = true;
    this.personalService.Insertar(this.objMedico)
      .subscribe({
        next: (data: any) => {
          if (data != false) {
            let id: any = data;
            this.idMedico = id;
            this.MostrarNotificacionSuccessModal('El proceso se realizó con éxito.', '');
            this.bsModalRef.content.onGuardar = () => { };

          }
          // else {
          //   this.sinAperturaCaja = true;
          //   this.MostrarNotificacionError('Debe aperturar una caja para continuar.', '¡Apertura de caja no valida!');
          // }
        },
        error: (e) => {
          this.verSpinner = false;
          this.manejadorMensajeErroresGuardar(e);
        },
        complete: () => { this.verSpinner = false; }
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
