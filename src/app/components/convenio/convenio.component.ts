import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CriterioBusquedaDirectorioDTO } from '@models/CriterioBusquedaDirectorioDTO';
import { ConsultaDoctoraliaDTO } from '@models/cuerpo-envio-doctoralia';
import { UtilitiesService } from '@services/utilities.service';
import { ListadoRespuestaDoctoraliaDTO } from '@models/ListadoRespuestaDoctoralia';

@Component({
  selector: 'app-convenio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './convenio.component.html',
  styleUrl: './convenio.component.css'
})
export default class ConvenioComponent implements OnInit{
  dataFormGroup: FormGroup;
  verSpinner:boolean = false;

  criterioBusqueda = new CriterioBusquedaDirectorioDTO();
  textoCriterioBusqueda:string="";
  listadoBusquedaDirectorio : ListadoRespuestaDoctoraliaDTO[]=[];

  objEnviarDirectorio = new ConsultaDoctoraliaDTO();

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private utilitiesService: UtilitiesService
  ){
    this.dataFormGroup = new FormGroup({
      selectUbicacion: new FormControl(),
      selectEspecialidad: new FormControl(),
    });
  }

  ngOnInit(): void {
    
  }
  Buscar() {
    this.verSpinner = true;
    this.criterioBusqueda = new CriterioBusquedaDirectorioDTO();
    this.textoCriterioBusqueda = "";
    let ciudad = this.dataFormGroup.controls['selectUbicacion'].value;
    let profesion = this.dataFormGroup.controls['selectEspecialidad'].value;
    let city:string[]=[];
    let professions:string[]=[];

    if (ciudad != '' && ciudad != null) {
      city.push(ciudad);
    }
    else{
      this.MostrarNotificacionError("Seleccione Ubicación","Error");
    }

    if (profesion != '' && profesion != null) {
      professions.push(profesion);
    }else{
      this.MostrarNotificacionError("Seleccione Profesion","Error");
    }

    this.objEnviarDirectorio.country='Peru';
    this.objEnviarDirectorio.city = city;
    this.objEnviarDirectorio.professions = professions;

    console.log("body", this.objEnviarDirectorio);
    this.utilitiesService.ObtenerDirectorioMedico(this.objEnviarDirectorio)
      .subscribe({
        next: (data) => {
          this.AsignarListado(data);

        },
        error: (e) => {
          this.MostrarNotificacionError('Por favor intente de nuevo.', '¡Hubo un error en la búsqueda!');
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      });

  }

  AsignarListado(data:any){
    this.listadoBusquedaDirectorio=data;
    console.log("listado", this.listadoBusquedaDirectorio);
  }
  AbrirDetalle(url:string){
      window.open(url, "_blank");
  }

  Limpiar() {
    this.dataFormGroup.reset();
    this.listadoBusquedaDirectorio = [];    
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string)
  {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }
  MostrarNotificacionError(mensaje: string, titulo:string)
  {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
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
}
