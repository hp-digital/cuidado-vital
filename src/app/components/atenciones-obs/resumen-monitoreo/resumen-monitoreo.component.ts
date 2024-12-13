import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resumen-monitoreo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './resumen-monitoreo.component.html',
  styleUrl: './resumen-monitoreo.component.css'
})
export class ResumenMonitoreoComponent implements OnInit {

  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();

  mensaje:string=''
  fecha=new Date();
  constructor(
    private modalCuadroControl: BsModalRef,
    private modalReceta: BsModalService,
    private historiaService: HistoriaService
  ){

  }

  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.modalCuadroControl.hide();
    //this.onGuardar();
  }
  
  AsignarHistoriaClinica(idHistoriaClinica:number, mensaje:string, fecha:Date){
    this.idHistoria=idHistoriaClinica;
    this.mensaje = mensaje;
    this.fecha = fecha;
  }
}