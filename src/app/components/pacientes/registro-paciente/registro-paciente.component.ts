import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PacienteService } from '../../../services/paciente.service';
import { forkJoin } from 'rxjs';
import { ComboDTO } from '../../../models/ComboDTO';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
  providers: [BsModalService],
})
export class RegistroPacienteComponent implements OnInit {
  
  dataFormGroup: FormGroup;
  comboTipoDocumento: ComboDTO[] = [];
  comboEstadoCivil : ComboDTO[] = [];

  verSpinner: boolean = false;

  constructor(
    private modalService: BsModalService,
    private bsModalRegistroPaciente: BsModalRef,
    private pacienteService: PacienteService
  ){
    this.dataFormGroup = new FormGroup({
      selectBuscarPorTipoDocumento: new FormControl(),
      selectRegistrarPorTipoDocumento: new FormControl(),
      inputFechaIngreso: new FormControl()
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
    ])
    .subscribe(
      data =>{
        this.comboTipoDocumento = data[0];
        this.comboEstadoCivil = data[1];
        console.log(data);
      },
      
      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
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
    this.bsModalRegistroPaciente.hide();
    //this.onGuardar();
  }
}
