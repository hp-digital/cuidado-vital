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

  Paciente = new PacienteDTO();
  idPaciente:number=0;

  verSpinner: boolean = false;
  constructor(
    private modalNuevoControl: BsModalRef,
    private modalService: BsModalService,
    private pacienteService: PacienteService
  ){
    this.dataFormGroup = new FormGroup({
      inputMotivoAtencion: new FormControl(),
      inputDocumentoBusqueda: new FormControl(),
      inputFechaIngreso: new FormControl(),
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
  }

  CargarDataInicio(){
    this.verSpinner = true;
    forkJoin([
      this.pacienteService.ObtenerTipoDocumento(),
      this.pacienteService.ObtenerEstadoCivil(),
      this.pacienteService.ObtenerSexo(),
      
    ])
    .subscribe(
      data =>{
        this.comboTipoDocumento = data[0];
        this.comboEstadoCivil = data[1];
        this.comboSexo = data[2];

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

  CerrarModal() {
    this.modalNuevoControl.hide();
    //this.onGuardar();
  }
}
