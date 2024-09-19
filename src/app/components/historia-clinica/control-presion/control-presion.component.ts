import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';


interface medidasAntropometricas {
  fecha: string;
  pa: string;
  fr: string;
  pulso: string;
  estado: string;
}

@Component({
  selector: 'app-control-presion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './control-presion.component.html',
  styleUrl: './control-presion.component.css'
})

export class ControlPresionComponent implements OnInit {

  public onGuardar: any;
  dataFormGroup: FormGroup;
  medidasPresion: medidasAntropometricas[] = [];
  listaEstadoPresion: string[] = [];

  constructor(
    private bsModalControlPresion: BsModalRef
  ) {
    this.dataFormGroup = new FormGroup({
      inputFecha: new FormControl('', [Validators.required]),
      inputPA: new FormControl('', [Validators.required]),
      inputFR: new FormControl('', [Validators.required]),
      inputPulso: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

  }

  CerrarModal() {
    this.bsModalControlPresion.hide();
    //this.onGuardar();
  }

  AgregarMedidasPresion() {
    const m = {
      fecha: this.dataFormGroup.controls['inputFecha'].value,
      pa: this.dataFormGroup.controls['inputPA'].value,
      fr: this.dataFormGroup.controls['inputFR'].value,
      pulso: this.dataFormGroup.controls['inputPulso'].value,
      estado: "",
    };
    this.medidasPresion.push(m);
    console.log('Medidas presion: ',this.medidasPresion);

  }

  
}
