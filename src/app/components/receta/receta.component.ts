import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-receta',
  standalone: true,
  imports: [],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.css'
})
export class RecetaComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private bsModalReceta: BsModalRef
  ){

  }

  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.bsModalReceta.hide();
    //this.onGuardar();
  }
}
