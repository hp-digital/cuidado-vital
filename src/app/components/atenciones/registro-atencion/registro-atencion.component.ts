import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-registro-atencion',
  standalone: true,
  imports: [],
  templateUrl: './registro-atencion.component.html',
  styleUrl: './registro-atencion.component.css'
})
export default class RegistroAtencionComponent implements OnInit{

  constructor(
    private modalRegistroAtencion: BsModalRef,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.modalRegistroAtencion.hide();
    //this.onGuardar();
  }
}
