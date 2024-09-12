import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-control-general',
  standalone: true,
  imports: [],
  templateUrl: './control-general.component.html',
  styleUrl: './control-general.component.css'
})
export class ControlGeneralComponent implements OnInit {
  constructor(
    private bsModalControlGeneral: BsModalRef
  ) {
  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalControlGeneral.hide();
    //this.onGuardar();
  }
}
