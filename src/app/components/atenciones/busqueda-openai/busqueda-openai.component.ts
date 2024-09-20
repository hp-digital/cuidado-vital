import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilitiesService } from '@services/utilities.service';

@Component({
  selector: 'app-busqueda-openai',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './busqueda-openai.component.html',
  styleUrl: './busqueda-openai.component.css'
})
export class BusquedaOpenaiComponent implements OnInit {

  dataFormGroup: FormGroup;

  prompt: string = '';
  generatedText: string = '';

  constructor(
    private bsModalConsultaIa: BsModalRef,
    private untilitiesService: UtilitiesService
  ){
    this.dataFormGroup = new FormGroup({
      inputTexto: new FormControl()
    });
  }

  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalConsultaIa.hide();
    //this.onGuardar();
  }

  AsignarDataConsulta(codigoCie10:string, diagnostico:string){

    this.dataFormGroup.controls['inputTexto'].setValue('Que significa el siguiente diagnóstico: '+codigoCie10+' '+diagnostico);
  }

  Consultar(){
    this.prompt = this.dataFormGroup.controls['inputTexto'].value;
    console.log(this.prompt)
    this.untilitiesService.generateText(this.prompt).subscribe(
      response => {
        // Asigna la respuesta generada al campo de texto
        this.generatedText = response.choices[0].message?.content || response.choices[0].text;
      },
      error => {
        console.error('Error al consumir la API de OpenAI:', error);
      }
    );
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
