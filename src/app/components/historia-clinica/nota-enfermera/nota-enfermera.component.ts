import { CommonModule  } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { UtilitiesService } from '@services/utilities.service';
import { HistoriaService } from '@services/historia.service';

@Component({
  selector: 'app-nota-enfermera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './nota-enfermera.component.html',
  styleUrl: './nota-enfermera.component.css'
})
export class NotaEnfermeraComponent implements OnInit{

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;

  paciente:string = '';
  medico:string='';
  nroHcl?:string='';

  objHistoria=new HistoriaCuidadoDTO();
  constructor(
    private modalNotaEnfermeria: BsModalRef,
    private modalService: BsModalService,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService,
  ){
    this.dataFormGroup = new FormGroup({
      inputTemperatura: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputPresionSistolica: new FormControl(),
      inputPresionDiastolica: new FormControl(),
      inputSaturacion: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
      inputTalla: new FormControl(),
      inputPeso: new FormControl(),
      inputOxigeno: new FormControl(),
      inputDeposiciones: new FormControl(),
      inputOrina: new FormControl(),
      inputIngresos: new FormControl(),
      inputEgresos: new FormControl(),
      inputTotalBH: new FormControl(),
    });
  }

  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.modalNotaEnfermeria.hide();
    //this.onGuardar();
  }
}
