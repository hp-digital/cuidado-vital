import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboDTO } from '@models/ComboDTO';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { DatosMonitoreoService } from '@services/datos-monitoreo.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-epoc',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './control-epoc.component.html',
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
export class ControlEpocComponent implements OnInit {
  dataFormGroup: FormGroup;
  comboFaseEpoc: ComboDTO[] = [];
  verSpinner:boolean = false;

  public onGuardar: any;
  comboBanio: ComboKatzDTO[] = [];
  comboVestido: ComboKatzDTO[] = [];
  comboWC: ComboKatzDTO[] = [];
  comboMovilidad: ComboKatzDTO[] = [];
  comboContinencia: ComboKatzDTO[] = [];
  comboAlimentacion: ComboKatzDTO[] = [];

  constructor(
    private bsModalControlEpoc: BsModalRef,
    private monitoreoService: DatosMonitoreoService,
  ) {
    this.dataFormGroup = new FormGroup({
      selectFaseEpoc: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();
  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
      this.monitoreoService.ObtenerBanio(),
      this.monitoreoService.ObtenerVestido(),
      this.monitoreoService.ObtenerWC(),
      this.monitoreoService.ObtenerMovilidad(),
      this.monitoreoService.ObtenerContinencia(),
      this.monitoreoService.ObtenerAlimentacion(),
      this.monitoreoService.ObtenerFaseEpoc(),

    ])
      .subscribe(
        data => {
          this.comboBanio = data[0];
          this.comboVestido = data[1];
          this.comboWC = data[2];
          this.comboMovilidad = data[3];
          this.comboContinencia = data[4];
          this.comboAlimentacion = data[5];
          this.comboFaseEpoc = data[6];

          this.verSpinner = false;
        },
        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      )
  }

  CerrarModal() {
    this.bsModalControlEpoc.hide();
    //this.onGuardar();
  }

  MostrarNotificacionError(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }

}
