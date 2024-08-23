import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import RegistroPacienteComponent from './registro-paciente/registro-paciente.component';
import EstadoAtencionComponent from '../atenciones/estado-atencion/estado-atencion.component';
import PagoAtencionComponent from '../atenciones/pago-atencion/pago-atencion.component';
import MotivoAtencionComponent from '../atenciones/motivo-atencion/motivo-atencion.component';
import RegistroAtencionComponent from '../atenciones/registro-atencion/registro-atencion.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, AvatarModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
  providers: [BsModalService],
})
export default class PacientesComponent implements OnInit {

  visible: boolean = false;
  //modalRef?: BsModalRef;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private modalEstadoAtencion: BsModalService,
    private modalEstadoPagoAtencion: BsModalService,
    private modalMotivoAtencion: BsModalService,
    private modalRegistroAtencion: BsModalService
  ){}

  ngOnInit(): void {
    
  }

  nuevoPaciente() {
    //this.modalRef = this.modalService.show(HistoriaClinicaComponent, { backdrop: 'static', class: 'modal-xl' });
    this.modalRef = this.modalService.show(RegistroPacienteComponent, { backdrop: 'static', class: 'modal-xl' });
  }

  estadoAtencion(){
    this.modalRef = this.modalEstadoAtencion.show(EstadoAtencionComponent, { backdrop: 'static', class: 'modal-xg' });
  }

  estadoPagoAtencion(){
    this.modalRef = this.modalEstadoPagoAtencion.show(PagoAtencionComponent, { backdrop: 'static', class: 'modal-xg' });
  }

  motivoAtencion(){
    this.modalRef = this.modalMotivoAtencion.show(MotivoAtencionComponent, { backdrop: 'static', class: 'modal-xg' });
  }

  registroAtencion(){
    this.modalRef = this.modalRegistroAtencion.show(RegistroAtencionComponent, { backdrop: 'static', class: 'modal-xl' })
  }

}
