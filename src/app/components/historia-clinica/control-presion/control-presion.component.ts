import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HistoriaService } from '@services/historia.service';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
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
  fechaHistoria= new Date();
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

    console.log("historia llega", historia);
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
    
    this.nroHcl = this.objHistoria.cabeceraPaciente?.NumeroDocumento;
    this.fechaHistoria = this.objHistoria.FechaInicioAtencion ;
    this.objControlPresion = objHistoria.ControlPresion;

    
    let control :  ControlPresionDTO[]=[];
    let medidas : MedidasAntropometricasDTO[]=[];

    if(objHistoria.ControlPresion!=null)
    {
      objHistoria.ControlPresion.forEach((element:any)=>{
        let s = new ControlPresionDTO();
        s.Fecha = element.Fecha;
        s.Paciente = element.Paciente;
        s.PlanTrabajo = element.PlanTrabajo;
        if(element.MedidasAntroprometricas != null)
        {
          element.MedidasAntroprometricas.forEach((sstf:any)=>{
            let _metr = new MedidasAntropometricasDTO();
            _metr.Diastolica = sstf.Diastolica;
            _metr.Sistolica = sstf.Sistolica;
            _metr.Fecha = sstf.Fecha;
            _metr.Fr = sstf.Fr;
            _metr.Pulso = sstf.Pulso;
            _metr.Estado = sstf.Estado;
            medidas.push(_metr);
          });
        }
        s.MedidasAntroprometricas = medidas;
        
        control.push(s);
      })
      this.objControlPresion = control;
    }

    console.log("controlss", this.objControlPresion)
    this.celularPaciente = objHistoria.cabeceraPaciente.Celular ;


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

  Guardar(){

    this.AsignarValores();
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    this.objHistoria.ControlPresion = this.objControlPresion;
    this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
      next: (data) => {
        this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
        this.CerrarModal();
      },
      error: (e) => {
        console.log('Error: ', e);
        this.verSpinner = false;
      },
      complete: () => { this.verSpinner = false; }
    });

  }

  AsignarValores(){
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    let presion = new ControlPresionDTO();
    presion.Fecha = new  Date();
    presion.Paciente = this.paciente;
    presion.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value;
    presion.MedidasAntroprometricas = this.medidasAntropometricas;

    this.objControlPresion.push(presion);
    
    console.log("presion", this.objControlPresion);
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
}
