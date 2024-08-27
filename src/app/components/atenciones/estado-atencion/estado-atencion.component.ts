import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-estado-atencion',
  standalone: true,
  imports: [],
  templateUrl: './estado-atencion.component.html',
  styleUrl: './estado-atencion.component.css'
})
export default class EstadoAtencionComponent implements OnInit {


  constructor(
    private modalEstadoAtencion: BsModalRef,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.modalEstadoAtencion.hide();
    //this.onGuardar();
  }
  
}
