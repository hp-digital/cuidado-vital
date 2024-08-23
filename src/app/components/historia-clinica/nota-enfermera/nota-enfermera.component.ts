import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-nota-enfermera',
  standalone: true,
  imports: [],
  templateUrl: './nota-enfermera.component.html',
  styleUrl: './nota-enfermera.component.css'
})
export class NotaEnfermeraComponent implements OnInit{

  constructor(
    private modalNotaEnfermeria: BsModalRef,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.modalNotaEnfermeria.hide();
    //this.onGuardar();
  }
}
