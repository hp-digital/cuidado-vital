import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormsModule  } from '@angular/forms';
import { SignalrService } from '@services/signalr.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaService } from '@services/historia.service';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgClass,FormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  
  public currentMessage: string = '';
  messages: { user: string, message: string }[] = [];
  public usersOnline: string[] = [];
  user: string = '';
  message: string = '';


  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();
  paciente:string ='';

  constructor(
    private signalService:SignalrService,
     private msModalChat:BsModalRef,
     private historiaService: HistoriaService,
     private settingsService: SettingsService
    ){

  }

  ngOnInit(): void {
    
    this.user = this.settingsService.getUserSetting('nombres');
    // Iniciar la conexión SignalR
    this.signalService.startConnection();

    // Suscribirse a mensajes
    this.signalService.messageReceived.subscribe(data => {
      if (data) {
        this.messages.push(data);
      }
    });

    // Suscribirse a cambios en usuarios conectados
    this.signalService.usersOnline.subscribe(users => {
      this.usersOnline = users;
    });
  }

  AsignarHistoriaClinica(idHistoriaClinica: number){
    this.idHistoria = idHistoriaClinica;
    this.ObtenerConfiguracion(idHistoriaClinica);
  }

  ObtenerConfiguracion(idHistoria:number){
    this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(idHistoria),
    ])
      .subscribe(
        data => {
          console.log("hcl", data[0]);
          this.AsignarObjetoInicial(data[0]);
          
          
          this.verSpinner = false;
        },
        err => {
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
          this.verSpinner = false;
        }
      );
  }

  AsignarObjetoInicial(data:any){
    this.verSpinner = true;
    let objHistoria: any = data;
    this.paciente = objHistoria.cabeceraPaciente.apellidoPaterno+' '+objHistoria.cabeceraPaciente.apellidoMaterno+', '+objHistoria.cabeceraPaciente.nombre;    
  }

    // Enviar un mensaje
    sendMessage(): void {
      if (this.user && this.message) {
        this.signalService.sendMessage(this.user, this.message);
        this.message = ''; // Limpiar el campo de mensaje
      }
    }

    CerrarModal() {
      this.msModalChat.hide();
      //this.onGuardar();
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
