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



  verSpinner: boolean = false;

  constructor(
    private modalRegistroAtencion: BsModalRef,
    private modalService: BsModalService,
    private servicioService: ServicioServiceService,
    private personalService: PersonalService
  ){
    this.dataFormGroup = new FormGroup({
      inputMotivoAtencion: new FormControl(),
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
