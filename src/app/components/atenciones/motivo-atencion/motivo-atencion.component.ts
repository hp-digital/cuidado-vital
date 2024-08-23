import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-motivo-atencion',
  standalone: true,
  imports: [],
  templateUrl: './motivo-atencion.component.html',
  styleUrl: './motivo-atencion.component.css'
})
export default class MotivoAtencionComponent implements OnInit {

  constructor(
    private modalMotivoAtencion: BsModalRef,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.modalMotivoAtencion.hide();
    //this.onGuardar();
  }

}
