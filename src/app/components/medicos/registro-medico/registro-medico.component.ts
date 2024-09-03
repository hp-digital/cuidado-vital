import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComboDTO } from '@models/ComboDTO';
import { DepartamentoDTO } from '@models/DepartamentoDTO';
import { ProvinciaDTO} from '@models/ProvinciaDTO';
import { DistritoDTO} from '@models/DistritoDTO';
import { ValoresDefectoCamposEnum } from '@enum/ValoresDefectoCamposEnum';
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
          margin-bottom: 0;
          padding-bottom: 0;
        }
      :host ::ng-deep th{
        border: none;
      }
      :host ::ng-deep .p-autocomplete-multiple-container{
        width:100% 
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
  comboPais: ComboDTO[] = [];
  comboDepartamento: ComboDTO[] = [];
  comboProvincia: ComboDTO[] = [];
  comboDistrito: ComboDTO[] = [];
  listaDepartamento: DepartamentoDTO[] = [];
  listaProvincia: ProvinciaDTO[] = [];
  listaDistrito: DistritoDTO[] = [];
  verSpinner: boolean = false;  
  disabledUbigeo:boolean=false;

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
      autocompleteEspecialidadMedica: new FormControl(),
      selectPaisDireccion: new FormControl('', [Validators.required]),
      selectDepartamentoDireccion: new FormControl('', [Validators.required]),
      selectProvinciaDireccion: new FormControl('', [Validators.required]),
      selectDistritoDireccion: new FormControl('', [Validators.required])
    });
  };

  ngOnInit(): void {
    this.CargarDataInicio();
    this.comboPais = JSON.parse(localStorage.getItem('Paises')!);
    this.listaDepartamento = JSON.parse(localStorage.getItem('Departamento')!);
    this.listaProvincia = JSON.parse(localStorage.getItem('Provincia')!);
    this.listaDistrito = JSON.parse(localStorage.getItem('Distrito')!);
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

  search(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.comboEspecialidades as any[]).length; i++) {
            let e = (this.comboEspecialidades as any[])[i];
            if (e.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(e);
            }
        }

        this.filteredEspecialidad = filtered;
  }
  
  MostrarNotificacionError(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
  }

  listarDepartamentos(e: any) {
    console.log('Id país: ',e.value);
    this.comboDepartamento = [];
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idPais = e.value;
    if(idPais == ValoresDefectoCamposEnum.Pais){
      this.comboDepartamento = this.pacienteService.ObtenerDepartamentos(e.value);
      this.ActivarValidacionesUbigeo();
      this.disabledUbigeo = false;      
    }
    else{
      this.disabledUbigeo = true;
      this.DesactivarValidacionesUbigeo();
    }   

    this.dataFormGroup.controls['selectDepartamentoDireccion'].setValue('');
    this.dataFormGroup.controls['selectProvinciaDireccion'].setValue('');
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
    this.ListarDepartamentos();
  }
  listarProvincias(e: any) {
    this.comboProvincia = [];
    this.comboDistrito = [];
    this.comboProvincia = this.pacienteService.ObtenerProvincias(e.value);
    this.dataFormGroup.controls['selectProvinciaDireccion'].setValue('');
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
    this.ListarProvincias();
  }
  listarDistritos(e: any) {
    this.comboDistrito = [];
    this.comboDistrito = this.pacienteService.ObtenerDistritos(e.value);
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
    this.ListarDistritos();
  }
  ActivarValidacionesUbigeo() {
    this.dataFormGroup.get('selectDepartamentoDireccion')?.setValidators([Validators.required]);
    this.dataFormGroup.get('selectDepartamentoDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectProvinciaDireccion')?.setValidators([Validators.required]);
    this.dataFormGroup.get('selectProvinciaDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectDistritoDireccion')?.setValidators([Validators.required]);
    this.dataFormGroup.get('selectDistritoDireccion')?.updateValueAndValidity();
  }
  DesactivarValidacionesUbigeo() {
    this.dataFormGroup.get('selectDepartamentoDireccion')?.clearValidators();
    this.dataFormGroup.get('selectDepartamentoDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectProvinciaDireccion')?.clearValidators();
    this.dataFormGroup.get('selectProvinciaDireccion')?.updateValueAndValidity();
    this.dataFormGroup.get('selectDistritoDireccion')?.clearValidators();
    this.dataFormGroup.get('selectDistritoDireccion')?.updateValueAndValidity();
  }
  ListarDepartamentos() {
    this.comboDepartamento = [];
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idPais = this.dataFormGroup.controls['selectPaisDireccion'].value;
    this.comboDepartamento = this.pacienteService.ObtenerDepartamentos(idPais);
    console.log('dptos: ', this.comboDepartamento);
  }
  ListarProvincias() {
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idDepartamento = this.dataFormGroup.controls['selectDepartamentoDireccion'].value;
    this.comboProvincia = this.pacienteService.ObtenerProvincias(idDepartamento);
  }
  ListarDistritos() {
    this.comboDistrito = [];
    let idProvincia = this.dataFormGroup.controls['selectProvinciaDireccion'].value;
    this.comboDistrito = this.pacienteService.ObtenerDistritos(idProvincia);
  }


}
