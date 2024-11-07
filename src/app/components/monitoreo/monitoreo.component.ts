import { AfterViewInit, Component, ViewChild, ElementRef, Injectable  } from '@angular/core';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaService } from '@services/historia.service';
import { SettingsService } from '@services/settings.service';
import Hls from 'hls.js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { UtilitiesService } from '@services/utilities.service';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.css'
})
export class MonitoreoComponent implements AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef;

  //videoSrc = 'http://192.168.1.37:3000/stream.m3u8'; 
  //videoSrc = 'https://rnpev-200-106-13-121.a.free.pinggy.link/stream.m3u8';
  videoSrc = 'http://200.106.13.121:3000/stream.m3u8';
  private apiUrl = 'https://170f-2001-1388-6660-114b-8c40-abcb-b5e5-e958.ngrok-free.app/';

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;

  objHistoria=new HistoriaCuidadoDTO();
  paciente:string ='';

  constructor(
    private modalService: BsModalService,
    private bsModalMonitoreo: BsModalRef,
    private historiaService: HistoriaService,
    private settings : SettingsService,
    private utilities : UtilitiesService,
    private http: HttpClient
  ) { 
    this.dataFormGroup = new FormGroup({

    });
  }

  ngAfterViewInit(): void {
    /* this.utilities.getData().subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        console.error('Error en la solicitud GET:', error);
      }
    ); */
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'any-value'  // Header para omitir la advertencia
    });

    let rpt = this.http.get(`${this.apiUrl}/your-endpoint`, { headers });
    
    /* if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.apiUrl);
      hls.attachMedia(this.videoElement.nativeElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoElement.nativeElement.play();
      });
    } */ 
   if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: (xhr) => {
            xhr.setRequestHeader('ngrok-skip-browser-warning', 'any-value'); // Agregar el header personalizado
          }
        });
        hls.loadSource(this.apiUrl+'stream.m3u8');
        hls.attachMedia(this.videoElement.nativeElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.videoElement.nativeElement.play();
        });
      }else if (this.videoElement.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Para Safari
      this.videoElement.nativeElement.src = this.videoSrc;
      this.videoElement.nativeElement.addEventListener('loadedmetadata', () => {
        this.videoElement.nativeElement.play();
      });
    }
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

  CerrarModal() {
    this.bsModalMonitoreo.hide();
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
