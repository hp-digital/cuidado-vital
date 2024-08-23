import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-epicrisis',
  standalone: true,
  imports: [],
  templateUrl: './epicrisis.component.html',
  styleUrl: './epicrisis.component.css'
})
export class EpicrisisComponent implements OnInit{


  constructor(
    private modalEpicrisis: BsModalRef,
    private modalService: BsModalService
  ){

  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.modalEpicrisis.hide();
    //this.onGuardar();
  }
}
