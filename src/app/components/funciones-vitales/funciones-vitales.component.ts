import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { SettingsService } from '@services/settings.service';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';

@Component({
  selector: 'app-funciones-vitales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './funciones-vitales.component.html',
  styleUrl: './funciones-vitales.component.css'
})
export class FuncionesVitalesComponent implements OnInit {

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();

  idRol:number=0;

  paciente:string ='';
  medico:string='';
  nroHcl:string='';
  fechaHistoria:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  constructor(
    private modalService: BsModalService,
    private bsModalFunciones: BsModalRef,
    private historiaService: HistoriaService,
    private settings : SettingsService
  ){
    this.dataFormGroup = new FormGroup({

    });
  }

  ngOnInit(): void {
    this.idRol=this.settings.getUserSetting('idRol');
  }

  CerrarModal() {
    this.bsModalFunciones.hide();
    //this.onGuardar();
  }

  AsignarHistoriaClinica(idHistoriaClinica: number){
    this.idHistoria = idHistoriaClinica;
    this.ObtenerConfiguracion(idHistoriaClinica);
  }

  ObtenerConfiguracion(idHistoria:number){
    this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(idHistoria),
    ])
      .subscribe(
        data => {
          console.log("hcl", data[0]);
          this.AsignarObjetoInicial(data[0]);
          
          
          this.verSpinner = false;
        },
        err => {
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
          this.verSpinner = false;
        }
      );
  }
  AsignarObjetoInicial(data:any){
    this.verSpinner = true;
    let objHistoria: any = data;
    this.paciente = objHistoria.cabeceraPaciente.apellidoPaterno+' '+objHistoria.cabeceraPaciente.apellidoMaterno+', '+objHistoria.cabeceraPaciente.nombre;
    this.nroHcl = objHistoria.cabeceraPaciente.numeroDocumento;
    this.fechaHistoria = objHistoria.cabeceraPaciente.fechaInicioAtencion ;
    this.celularPaciente = objHistoria.cabeceraPaciente.celular ;
    
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
