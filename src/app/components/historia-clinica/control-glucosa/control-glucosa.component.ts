import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlGlucosaDTO } from '@models/controlGlucosaDTO';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaService } from '@services/historia.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CalendarModule } from 'primeng/calendar';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

interface objExamenes {
  nombre: string;
  valor: string;
  fecha: string;
}

interface objPrestacion {
  nombre: string;
  monodroga: string;
  dosis: string;
}

@Component({
  selector: 'app-control-glucosa',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './control-glucosa.component.html',
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

export class ControlGlucosaComponent implements OnInit {
  dataFormGroup: FormGroup;
  verSpinner: boolean = false;

  paciente: string = '';
  medico: string = '';
  nroHcl: string = '';
  fechaHistoria: string = '';
  fechaNacimientoPaciente: string = '';
  celularPaciente: string = '';
  emailPaciente: string = '';
  direccionPaciente: string = '';
  procedencia: string = '';
  idHistoria:number=0;

  arrayExamenes: objExamenes[] = [];
  arrayPrestacion: objPrestacion[] = [];

  objHistoria=new HistoriaCuidadoDTO();
  objControl : ControlGlucosaDTO[]=[];


  constructor(
    private bsModalControlGlucosa: BsModalRef,
    private historiaService: HistoriaService,
  ) {
    this.dataFormGroup = new FormGroup({

      inputTipoDiabetes: new FormControl(''),
      inputFechaDiagnostico: new FormControl('', [Validators.required]),
      radioComplicaciones: new FormControl('si'),
      radRetinopatia: new FormControl(''),
      radNefropatia: new FormControl(''),
      radAmputacion: new FormControl(''),
      radDialisis: new FormControl(''),
      radCeguera: new FormControl(''),
      radRenal: new FormControl(''),
      inputPeso: new FormControl(''),
      inputTalla: new FormControl(''),
      inputIMC: new FormControl(''),
      inputPerimetroAbdominal: new FormControl(''),
      inputPresionArterial: new FormControl(''),
      inputPlanTrabajo: new FormControl(''),

    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();

  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
    ])
      .subscribe(
        data => {
        },
        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      );
    this.cargarTablas();
  }

  cargarTablas() {
    this.arrayExamenes = [
      {
        nombre: 'Glucemia',
        valor: 'x',
        fecha: ''
      },
      {
        nombre: 'HBA1C',
        valor: 'x',
        fecha: ''
      },
      {
        nombre: 'Creatinina',
        valor: 'x',
        fecha: ''
      },
      {
        nombre: 'LDL',
        valor: 'x',
        fecha: ''
      },
      {
        nombre: 'Trigliceridos',
        valor: 'x',
        fecha: ''
      },
      {
        nombre: 'Microalbuminuria',
        valor: 'x',
        fecha: ''
      }
    ];

    this.arrayPrestacion = [
      {
        nombre: 'Insulina',
        monodroga: 'x',
        dosis: ''
      },
      {
        nombre: 'HBA1C',
        monodroga: 'x',
        dosis: ''
      }
    ]
  }

  CerrarModal() {
    this.bsModalControlGlucosa.hide();
    //this.onGuardar();
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

  Guardar(){
    this.AsignarValores();
    if(this.objControl.length==0)
      {
        this.MostrarNotificacionError("Valores Imcompletos", "Error");
      }
      else{
        this.objHistoria.IdHistoriaClinica = this.idHistoria;
        this.objHistoria.ControlGlucosa = this.objControl;
        this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
          next: (data) => {
            this.MostrarNotificacionSuccessModal('La historia se guardó con éxito.', '');
          },
          error: (e) => {
            console.log('Error: ', e);
            this.verSpinner = false;
          },
          complete: () => { this.verSpinner = false; }
        });
      }
  
  }

  AsignarValores()
  {
    let controlGlucosa = new ControlGlucosaDTO();
    controlGlucosa.Paciente = this.paciente;
    controlGlucosa.TipoDiabetes = this.dataFormGroup.controls['inputTipoDiabetes'].value ;
    controlGlucosa.FechaDiagnostico = this.dataFormGroup.controls['inputFechaDiagnostico'].value ;
    controlGlucosa.Complicaciones = this.dataFormGroup.controls['radioComplicaciones'].value ;
    controlGlucosa.Retinopatia = this.dataFormGroup.controls['radRetinopatia'].value ;
    controlGlucosa.Nefropatia = this.dataFormGroup.controls['radNefropatia'].value ;
    controlGlucosa.Amputacion = this.dataFormGroup.controls['radAmputacion'].value ;
    controlGlucosa.Dialisis = this.dataFormGroup.controls['radDialisis'].value ;
    controlGlucosa.Ceguera = this.dataFormGroup.controls['radCeguera'].value ;
    controlGlucosa.TransplanteRenal = this.dataFormGroup.controls['radRenal'].value ;
    
    controlGlucosa.Talla = this.dataFormGroup.controls['inputTalla'].value ;
    controlGlucosa.Peso = this.dataFormGroup.controls['inputPeso'].value ;
    controlGlucosa.IMC = this.dataFormGroup.controls['inputIMC'].value ;
    controlGlucosa.PerimetroAbdominal = this.dataFormGroup.controls['inputPerimetroAbdominal'].value ;
    controlGlucosa.PresionArterial = this.dataFormGroup.controls['inputPresionArterial'].value ;
    controlGlucosa.ExamenGlucosa = this.arrayExamenes ;
    controlGlucosa.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value ;
    controlGlucosa.PrestacionGlucosa = this.arrayPrestacion ;

    console.log(controlGlucosa);
    this.objControl.push(controlGlucosa);
    console.log(this.objControl)

  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    this.objHistoria.ControlGlucosa = this.objControl;
    this.AsignarObjetoHistoria(historia);
  }

  AsignarObjetoHistoria(data:any)
  {
    this.verSpinner = true;
    let objHistoria: any = data;

    this.paciente = objHistoria.HistoriaExterna.paciente.apellidoPaterno+' '+objHistoria.HistoriaExterna.paciente.apellidoMaterno+', '+objHistoria.HistoriaExterna.paciente.nombres;
    this.medico = objHistoria.HistoriaExterna.medico.apellidoPaterno+' '+objHistoria.HistoriaExterna.medico.apellidoMaterno+', '+objHistoria.HistoriaExterna.medico.nombres;
    this.nroHcl = objHistoria.HistoriaExterna.paciente.numeroDocumento;
    this.fechaHistoria = objHistoria.FechaInicioAtencion ;
    this.fechaNacimientoPaciente = objHistoria.HistoriaExterna.fechaNacimiento;
    this.celularPaciente = objHistoria.HistoriaExterna.paciente.celular ;
    this.emailPaciente = objHistoria.HistoriaExterna.paciente.email ;
    this.direccionPaciente = objHistoria.HistoriaExterna.paciente.direccion ;
    this.procedencia = objHistoria.HistoriaExterna.razonSocial;
    
  }
}
