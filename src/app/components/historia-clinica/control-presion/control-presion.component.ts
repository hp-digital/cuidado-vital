import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-control-presion',
  standalone: true,
  imports: [],
  templateUrl: './control-presion.component.html',
  styleUrl: './control-presion.component.css'
})
export class ControlPresionComponent implements OnInit {
  constructor(
    private bsModalControlPresion: BsModalRef
  ) {
  }
  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.bsModalControlPresion.hide();
    //this.onGuardar();
  }
}
