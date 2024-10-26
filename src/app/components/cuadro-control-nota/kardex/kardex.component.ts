import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilitiesService } from '@services/utilities.service';
import { HistoriaService } from '@services/historia.service';

@Component({
  selector: 'app-kardex',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './kardex.component.html',
  styleUrl: './kardex.component.css'
})
export class KardexComponent implements OnInit{

  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();
  
  paciente:string = '';

  constructor(
    private bsModalKardex: BsModalRef,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService
  ){

  }


  ngOnInit(): void {
    this.ObtenerConfiguracion();
  }

  ObtenerConfiguracion() {
    this.verSpinner = true;
    forkJoin([
      
      ]
    )
      .subscribe(
        data => {

          
          this.verSpinner = false;
        },
        err => {
          this.verSpinner = false;
        }
      );
  }

  CerrarModal() {
    this.bsModalKardex.hide();
    //this.onGuardar();
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    
    this.idHistoria = idHistoria;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.objHistoria= historia;
    console.log("obj historia", this.objHistoria);
    //this.AsignarHistoria(historia);
  }

  Guardar(){
   /*  this.AgregarValoresObjeto();
    this.objHistoria.ControlGlucosa = this.objControlGlucosa;
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    console.log("historia guardar", this.objHistoria);

    this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
      next: (data) => { */
        this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
        /* this.eventControl.emit(this.objControlGlucosa)
        this.CerrarModal();
      },
      error: (e) => {
        console.log('Error: ', e);
        this.verSpinner = false;
      },
      complete: () => { this.verSpinner = false; }
    });
 */
  }

  MostrarNotificacionInfo(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: mensaje
    });
  }

  MostrarNotificacionWarning(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje
    });
  }
  manejadorMensajeErroresGuardar(e: any) {
    if (typeof e != "string") {
      let error = e;
      let arrayErrores: any[] = [];
      let errorValidacion = Object.keys(e);
      if (Array.isArray(errorValidacion)) {
        errorValidacion.forEach((propiedadConError: any) => {
          error[propiedadConError].forEach((mensajeError: any) => {
            if (!arrayErrores.includes(mensajeError['mensaje'])) {
              arrayErrores.push(mensajeError['mensaje']);
            }
          });
        });
        this.MostrarNotificacionError(arrayErrores.join("<br/>"), '¡ERROR EN EL PROCESO!')
      } else {
        this.MostrarNotificacionError("", '¡ERROR EN EL PROCESO!')
      }
    }
    else {
      this.MostrarNotificacionError(e, '¡ERROR EN EL PROCESO!');
    }
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
    this.CerrarModal();
  }
}
