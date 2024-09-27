import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CalendarModule } from 'primeng/calendar';


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
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule
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
      inputPASistolica: new FormControl('', [Validators.required]),
      inputPADiastolica: new FormControl('', [Validators.required]),
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
    console.log('Medidas presion: ', this.medidasPresion);
  }

  EliminarFila(index: any) {
    this.medidasPresion.splice(index, 1);
  }

  CalcularPresion(s: number, d: number): string {
    if (s < 80 && d < 60) {
      return 'HIPOTENSION';
    }
    if ((s > 80 && s < 120) && (d > 60 && d < 80)) {
      return 'NORMOTENSION';
    }
    if ((s > 120 && s < 139) && (d > 80 && d < 89)) {
      return 'PREHIPERTENSION';
    }
    if ((s > 140 && s < 159) && (d > 90 && d < 99)) {
      return 'HIPERTENSION G.1';
    }
    if ((s > 160 && s < 180) && (d > 100 && d < 110)) {
      return 'HIPERTENSION G.2';
    }
    if (s > 180 && 110) {
      return 'CRISISHIPERTENSIVA';
    }
    
    return '';
  }


}
