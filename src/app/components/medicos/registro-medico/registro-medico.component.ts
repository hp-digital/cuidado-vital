import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComboDTO } from '@models/ComboDTO';
import { PacienteService } from '@services/paciente.service';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-registro-medico',
  standalone: true,  
  templateUrl: './registro-medico.component.html',
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    CalendarModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
  ],
  styles: [`
     :host ::ng-deep ul{
        padding-left:0 !important;
      }
     :host ::ng-deep th{
        border: none;
      }
  `],
})

export class RegistroMedicoComponent implements OnInit {

  date2: Date | undefined;

  items: any[] | undefined;
  autocompleteEspecialidadMedica: any;
  filteredEspecialidad: any[] = [];
  dataFormGroup: FormGroup;
  comboTipoDocumento: ComboDTO[] = [];
  comboEspecialidades: ComboDTO[]=[];
  verSpinner: boolean = false;

  search(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.comboEspecialidades as any[]).length; i++) {
            let e = (this.comboEspecialidades as any[])[i];
            if (e.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(e);
            }
        }

        this.filteredEspecialidad = filtered;
  }

  constructor(
    private bsModalRegistroMedico: BsModalRef,
    private messageService: MessageService,
    private pacienteService: PacienteService
  ) {
    this.dataFormGroup = new FormGroup({
      selectBuscarPorTipoDocumento: new FormControl(),
      selectRegistrarPorTipoDocumento: new FormControl(),
      inputFechaIngreso: new FormControl(), 
      date2: new FormControl(),
      autocompleteEspecialidadMedica: new FormControl()
    });
  };

  ngOnInit(): void {
    this.CargarDataInicio();
  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
      this.pacienteService.ObtenerTipoDocumento(),
      this.pacienteService.ObtenerEspecialidadMedica(),
    ])
      .subscribe(
        data => {
          this.comboTipoDocumento = data[0];
          this.comboEspecialidades = data[1];
        },

        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      )
  }


  CerrarModal() {
    this.bsModalRegistroMedico.hide();
  }

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se subió el archivo con éxito' });
  }

  MostrarNotificacionError(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
  }
}
