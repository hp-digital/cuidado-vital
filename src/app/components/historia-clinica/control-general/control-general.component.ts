import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-control-general',
  standalone: true,
  imports: [],
  templateUrl: './control-general.component.html',
  styles: [`
    :host ::ng-deep ul{
        padding-left:0 !important;
        margin-bottom: 0;
        padding-bottom: 0;
      }
    :host ::ng-deep th{
      border: none;
    }
    :host ::ng-deep .p-autocomplete-multiple-container{
      width:100% 
    }
`],
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
