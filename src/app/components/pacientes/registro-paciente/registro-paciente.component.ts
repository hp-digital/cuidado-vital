import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PacienteService } from '../../../services/paciente.service';
import { forkJoin } from 'rxjs';
import { ComboDTO } from '../../../models/ComboDTO';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartamentoDTO } from '../../../models/DepartamentoDTO';
import { ProvinciaDTO } from '../../../models/ProvinciaDTO';
import { DistritoDTO } from '../../../models/Distrito';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,AutoCompleteModule,FormsModule,DropdownModule],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
  providers: [BsModalService],
})
export class RegistroPacienteComponent implements OnInit {
  
  dataFormGroup: FormGroup;
  comboTipoDocumento: ComboDTO[] = [];
  comboEstadoCivil : ComboDTO[] = [];
  comboSexo: ComboDTO[] = [];
  comboPais: ComboDTO[] = [];

  listaDepartamento: DepartamentoDTO[] = [];
  listaProvincia: ProvinciaDTO[] = [];
  listaDistrito: DistritoDTO[] = [];

  comboDepartamento: ComboDTO[] = [];
  comboProvincia: ComboDTO[] = [];
  comboDistrito: ComboDTO[] = [];
  comboDepartamentoFamiliar: ComboDTO[] = [];
  comboProvinciaFamiliar: ComboDTO[] = [];
  comboDistritoFamiliar: ComboDTO[] = [];

  selectedPais:any;

  verSpinner: boolean = false;


  paisId: number=0;

  filteredItems: any[] =[];

  items: any[] | undefined;

  constructor(
    private modalService: BsModalService,
    private bsModalRegistroPaciente: BsModalRef,
    private pacienteService: PacienteService
  ){
    this.dataFormGroup = new FormGroup({
      selectBuscarPorTipoDocumento: new FormControl(),
      inputFechaIngreso: new FormControl(),
      selectRegistrarPorTipoDocumento: new FormControl(),
      inputNumeroDocumento: new FormControl(),
      inputApellidoPaternoPaciente: new FormControl(),
      inputApellidoMaternoPaciente: new FormControl(),
      inputNombrePaciente: new FormControl(),
      inputFechaNacimientoPaciente: new FormControl(),
      inputEdadPaciente: new FormControl(),
      inputSexoPaciente: new FormControl(),
      inputTelefonoPaciente: new FormControl(),
      inputCorreoPaciente: new FormControl(),
      selectEstadoCivilPaciente: new FormControl(),
      selectPaisDireccion: new FormControl(),
      inputDomicilioActual: new FormControl(),
      buscarDniFamiliar: new FormControl(),
      selectTipoDocumentoFamiliar: new FormControl(),
      inputNumeroDocumentoFamiliar: new FormControl(),
      inputApellidoPaternoFamiliar: new FormControl(),
      inputApellidoMaternoFamiliar: new FormControl(),
      inputNombreFamiliar: new FormControl(),
      inputFechaNacimientoFamiliar: new FormControl(),
      inputEdadFamiliar: new FormControl(),
      inputSexoFamiliar: new FormControl(),
      inputTelefonoFamiliar: new FormControl(),
      inputWhatsappFamiliar: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();
    //this.dataFormGroup.controls['inputFechaIngreso'].setValue(moment().format('DD/MM/YYYY'));
  }

  CargarDataInicio(){
    this.verSpinner = true;
    forkJoin([
      this.pacienteService.ObtenerTipoDocumento(),
      this.pacienteService.ObtenerEstadoCivil(),
      this.pacienteService.ObtenerSexo(),
      
    ])
    .subscribe(
      data =>{
        this.comboTipoDocumento = data[0];
        this.comboEstadoCivil = data[1];
        this.comboSexo = data[2];

        this.comboPais = JSON.parse(localStorage.getItem('Paises')!);
        this.listaDepartamento = JSON.parse(localStorage.getItem('Departamento')!);
        this.listaProvincia = JSON.parse(localStorage.getItem('Provincia')!);
        this.listaDistrito = JSON.parse(localStorage.getItem('Distrito')!);
        this.verSpinner = false;
        ;
      },
      
      err => {
        console.log(err);
        this.MostrarNotificacionError('Intente de nuevo', 'Error');
        this.verSpinner = false;
      }
    )
  }
  

  listarDepartamentos(e: any) {
    console.log('Id país: ', e.value);
    this.comboDepartamento = [];
    this.comboProvincia = [];
    this.comboDistrito = [];
    let idPais = e.value;
    /* if (idPais == ValoresDefectoCamposEnum.Pais) { */
      this.comboDepartamento = this.pacienteService.ObtenerDepartamentos(e.value);
      this.comboDepartamentoFamiliar = this.pacienteService.ObtenerDepartamentos(e.value);
/*       this.ActivarValidacionesUbigeo();
      this.disabledUbigeo = false;
    }
    else {
      this.disabledUbigeo = true;
      this.DesactivarValidacionesUbigeo();
    } */

    this.dataFormGroup.controls['selectDepartamentoDireccion'].setValue('');
    this.dataFormGroup.controls['selectProvinciaDireccion'].setValue('');
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
  }

  listarProvincias(e: any) {
    this.comboProvincia = [];
    this.comboDistrito = [];
    this.comboDistritoFamiliar = [];
    this.comboProvincia = this.pacienteService.ObtenerProvincias(e.value);
    this.comboProvinciaFamiliar = this.pacienteService.ObtenerProvincias(e.value);
    this.dataFormGroup.controls['selectProvinciaDireccion'].setValue('');
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
  }

  listarDistritos(e: any) {
    this.comboDistrito = [];
    this.comboDistrito = this.pacienteService.ObtenerDistritos(e.value);
    this.dataFormGroup.controls['selectDistritoDireccion'].setValue('');
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

  CerrarModal() {
    this.bsModalRegistroPaciente.hide();
    //this.onGuardar();
  }
}
