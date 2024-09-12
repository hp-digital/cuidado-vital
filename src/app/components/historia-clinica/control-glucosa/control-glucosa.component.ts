import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-control-glucosa',
  standalone: true,
  imports: [],
  templateUrl: './control-glucosa.component.html',
  styleUrl: './control-glucosa.component.css'
})
export class ControlGlucosaComponent implements OnInit {
  constructor(
    private bsModalControlGlucosa: BsModalRef
  ) {
  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalControlGlucosa.hide();
    //this.onGuardar();
  }

}
