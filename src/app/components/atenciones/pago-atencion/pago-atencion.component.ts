import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pago-atencion',
  standalone: true,
  imports: [],
  templateUrl: './pago-atencion.component.html',
  styleUrl: './pago-atencion.component.css'
})
export default class PagoAtencionComponent implements OnInit{

  constructor(
    private modalPagoAtencion: BsModalRef,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.modalPagoAtencion.hide();
    //this.onGuardar();
  }
}
