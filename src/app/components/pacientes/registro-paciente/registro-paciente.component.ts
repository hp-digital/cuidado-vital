import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
  providers: [BsModalService],
})
export default class RegistroPacienteComponent implements OnInit {


  constructor(
    private modalService: BsModalService,
    private bsModalRegistroPaciente: BsModalRef
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalRegistroPaciente.hide();
    //this.onGuardar();
  }
}
