import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HistoriaService } from '@services/historia.service';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
import { isBetween } from 'node_modules/ngx-bootstrap/chronos/utils/date-compare';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { ControlPresionDTO } from '@models/control-presion';


@Component({
  selector: 'app-control-presion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './control-presion.component.html',
  styleUrl: './control-presion.component.css'
})

export class ControlPresionComponent implements OnInit {

  public onGuardar: any;
  dataFormGroup: FormGroup;
  listaEstadoPresion: string[] = [];
  
  medidasAntropometricas:MedidasAntropometricasDTO[]=[];

  objHistoria=new HistoriaCuidadoDTO();
  idHistoria:number=0;
  verSpinner:boolean = false;

  objControlPresion:ControlPresionDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';
  fechaHistoria?:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  constructor(
    private bsModalControlPresion: BsModalRef,
    private historiaService: HistoriaService,
  ) {
    this.dataFormGroup = new FormGroup({
      inputFecha: new FormControl('', [Validators.required]),
      inputPA: new FormControl('', [Validators.required]),
      inputDiastolica: new FormControl(),
      inputFR: new FormControl('', [Validators.required]),
      inputPulso: new FormControl('', [Validators.required]),
      inputPlanTrabajo: new FormControl()
    });
  }

  ngOnInit(): void {

  }

  CerrarModal() {
    this.bsModalControlPresion.hide();
    //this.onGuardar();
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){

    //console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    //this.objControlPresion = historia.ControlPresion;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.AsignarObjetoHistoria(historia);
  }

  AsignarObjetoHistoria(data:any)
  {
    this.verSpinner = true;
    let objHistoria: any = data;
    console.log("objHistoria",objHistoria);
    //this.paciente = objHistoria.cabeceraPaciente.apellidoMaterno+' '+objHistoria.cabeceraPaciente.apellidoMaterno+', '+objHistoria.cabeceraPaciente.nombre;
    /* this.medico = objHistoria.HistoriaExterna.medico.apellidoPaterno+' '+objHistoria.HistoriaExterna.medico.apellidoMaterno+', '+objHistoria.HistoriaExterna.medico.nombres; */
    this.nroHcl = this.objHistoria.cabeceraPaciente?.NumeroDocumento;
    this.fechaHistoria = this.objHistoria.cabeceraPaciente?.FechaAtencion.toString() ;
    this.objControlPresion = objHistoria.controlPresion;
    /* this.fechaNacimientoPaciente = objHistoria.HistoriaExterna.fechaNacimiento; */
    this.celularPaciente = objHistoria.cabeceraPaciente.Celular ;
    /* this.emailPaciente = objHistoria.HistoriaExterna.paciente.email ;
    this.direccionPaciente = objHistoria.HistoriaExterna.paciente.direccion ;
    this.procedencia = objHistoria.HistoriaExterna.razonSocial; */
    
  }

  AgregarMedidasPresion() {
 
    let medidas = new MedidasAntropometricasDTO();
    medidas.Fecha = this.dataFormGroup.controls['inputFecha'].value;
    let sist = this.dataFormGroup.controls['inputPA'].value;
    medidas.Sistolica = sist;
    let diast = this.dataFormGroup.controls['inputDiastolica'].value;
    medidas.Diastolica = diast;
    medidas.Fr = this.dataFormGroup.controls['inputFR'].value;
    medidas.Pulso = this.dataFormGroup.controls['inputPulso'].value;
    medidas.Estado = this.ObtenerEstado(sist, diast);

    this.medidasAntropometricas.push(medidas);
  }

  ObtenerEstado(sistolica:number, diastolica: number)
  {
    if(sistolica<80 && diastolica<60)
      return "Hipotension";
    if(sistolica>=80 && sistolica<=120 && diastolica>60 && diastolica<=80)
      return "Normotension";
    if(sistolica>=120 && sistolica<=139 && diastolica>80 && diastolica<=89)
      return "Pre Hipertensión";
    if(sistolica>=140 && sistolica<=159 && diastolica>90 && diastolica<=99)
      return "Hipertensión G.1";
    if(sistolica>=160 && sistolica<=179 && diastolica>100 && diastolica<=109)
      return "Hipertensión G.2";
    if(sistolica>=180 && diastolica>110 )
      return "Crisishipertensiva";
    return '-'
  }

  
}
