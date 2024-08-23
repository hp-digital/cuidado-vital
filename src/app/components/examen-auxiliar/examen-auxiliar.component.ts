import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-examen-auxiliar',
  standalone: true,
  imports: [],
  templateUrl: './examen-auxiliar.component.html',
  styleUrl: './examen-auxiliar.component.css'
})
export class ExamenAuxiliarComponent implements OnInit {

  constructor(
    private bsModalExamenAuxiliar: BsModalRef
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalExamenAuxiliar.hide();
    //this.onGuardar();
  }
}
