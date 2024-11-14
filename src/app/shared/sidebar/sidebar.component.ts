import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { CommonModule } from '@angular/common';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { PersonalService } from '@services/personal.service';
import { ListadoEspecialidadPersonalDTO } from '@models/listado-especialidad-personal';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  implements OnInit{

  idRol:number = 0;
  idPersonal:number = 0;

  idEspecialidad: number=0;

  verSpinner: boolean = false;

  esObstetricia: boolean = false;

  comboEspecialidadPersonal: ListadoEspecialidadPersonalDTO[]=[];

  constructor(
   private settings: SettingsService,
   private personalService: PersonalService
  ){

  }

  ngOnInit(): void {
    this.idRol=this.settings.getUserSetting('idRol');
    this.idPersonal = this.settings.getUserSetting('idPersonal');
    this.ObtenerEspecialidad(this.idPersonal);
  }

  ObtenerEspecialidad(idPersonal:number){
    this.verSpinner = true;

    forkJoin([
      this.personalService.ObtenerEspecialidadPersonalId(idPersonal),
    ])
    .subscribe(
      data =>{
        this.comboEspecialidadPersonal = data[0];
        
        this.SetVista(this.comboEspecialidadPersonal);
        
      },

      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }

  SetVista(sstf:ListadoEspecialidadPersonalDTO[])
  {
    console.log(sstf)
    sstf.forEach((element:any)=>{
      if(element.idEspecialidadMedica == 1){
        this.esObstetricia=true
      }
    });
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
