import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-registro-medico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule
  ],
  templateUrl: './registro-medico.component.html',
  styleUrl: './registro-medico.component.css',
  providers: [MessageService]
})
export class RegistroMedicoComponent implements OnInit {

  dataFormGroup: FormGroup;

  constructor(private bsModalRegistroMedico: BsModalRef, private messageService: MessageService) {
    this.dataFormGroup = new FormGroup({
      selectBuscarPorTipoDocumento: new FormControl(),
      selectRegistrarPorTipoDocumento: new FormControl(),
      inputFechaIngreso: new FormControl()
    });
  };

  CerrarModal() {
    this.bsModalRegistroMedico.hide();
  }

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se subió el archivo con éxito' });
  }

  ngOnInit(): void {
    // this.CargarDataInicio();
  }

  
}
