import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-control-epoc',
  standalone: true,
  imports: [],
  templateUrl: './control-epoc.component.html',
  styleUrl: './control-epoc.component.css'
})
export class ControlEpocComponent implements OnInit {
  constructor(
    private bsModalControlEpoc: BsModalRef
  ) {
  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalControlEpoc.hide();
    //this.onGuardar();
  }

}
