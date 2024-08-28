import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {RegistroMedicoComponent} from './registro-medico/registro-medico.component';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [],
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.css',
  providers: [BsModalService],
})
export default class MedicosComponent implements OnInit{

  visible: boolean = false;

  constructor( 
    private modalRef: BsModalRef,
    private modalService: BsModalService,
  ){};

  ngOnInit(): void {
    
  }

  nuevoMedico() {
    this.modalRef = this.modalService.show(RegistroMedicoComponent, { backdrop: 'static', class: 'modal-xl' });
  }
}
