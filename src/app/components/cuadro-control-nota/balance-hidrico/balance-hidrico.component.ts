import { CommonModule  } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilitiesService } from '@services/utilities.service';
import { HistoriaService } from '@services/historia.service';
import { SettingsService } from '@services/settings.service';
import { BalanceHidricoTurnoDTO } from '@models/balance-hidrico-turno';
import { BalanceHidricoDetalleDTO } from '@models/balance-hidrico-detalle';
import { BalanceHidricoEgresoDTO } from '@models/balance-hidrico-egreso';
import { BalanceHidricoIngresoDTO } from '@models/balance-hidrico-ingresos';
import { BalanceHidricoDTO } from '@models/balance-hidrico';

@Component({
  selector: 'app-balance-hidrico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './balance-hidrico.component.html',
  styleUrl: './balance-hidrico.component.css'
})
export class BalanceHidricoComponent implements OnInit {

  dataFormGroup: FormGroup;
  idHistoria:number=0;
  verSpinner:boolean = false;
  fechaHoy=new Date();

  paciente:string = '';
  medico:string='';
  nroHcl?:string='';

  nombreUsuario:string='';
  apellidoUsuario:string='';

  objHistoria=new HistoriaCuidadoDTO();
  objBalanceHidrico = new BalanceHidricoDTO();

  textoResultado: string = '';
  listadoBalanceHidrico: BalanceHidricoTurnoDTO[] = [];
  verErrorIngreso: Boolean = false;
  verErrorEgreso: Boolean = false;
  habilitarBotonImpresion: boolean = true;
  esEstadoSolicitudCamaAlta: boolean = false;
  IMC: number = 0;
  listadoOtrosIngreso: BalanceHidricoDetalleDTO[] = [];
  listadoOtrosEgreso: BalanceHidricoDetalleDTO[] = [];
  listadoDrenaje: BalanceHidricoDetalleDTO[] = [];
  esActualizarBalanceHidrico: boolean = false;
  esItemActualizar?: number;
  esItemVisualizar: number = 0;
  itemIngresoOtros = new BalanceHidricoDetalleDTO();
  itemEgresoOtros = new BalanceHidricoDetalleDTO();
  itemDrenaje = new BalanceHidricoDetalleDTO();
  idEspecialidadMedicaDestino: number = 0;
  edadPaciente: number = 0;
  modalVisualizarhistoria!: BsModalRef;
  verListaIngresosEgresos: boolean = false

  constructor(
    private modalBalance: BsModalRef,
    private modalService: BsModalService,
    private utilitiesService: UtilitiesService,
    private historiaService: HistoriaService,
    private settingService: SettingsService
  ){
    this.dataFormGroup = new FormGroup({
      inputPeso: new FormControl('', ),
      inputTalla: new FormControl('', ),
      inputImc: new FormControl('', ),
      inputTiempo: new FormControl('', ),
      /*INGRESOS*/
      // ingreso oral 
      inputPrimerOral: new FormControl('', ),
      inputSegundoOral: new FormControl('', ),
      inputTotalOral: new FormControl('', ),
      // ingreso Parental  
      inputPrimerParental: new FormControl('', ),
      inputSegundoParental: new FormControl('', ),
      inputTotalParental: new FormControl('', ),
      // ingreso Parental tratamiento
      inputPrimerParentalTratamiento: new FormControl('', ),
      inputSegundoParentalTratamiento: new FormControl('', ),
      inputTotalParentalTratamiento: new FormControl('', ),
      // ingreso Sangre  
      inputPrimerSangre: new FormControl('', ),
      inputSegundoSangre: new FormControl('', ),
      inputTotalSangre: new FormControl('', ),
      // ingreso Agua Oxidacion  
      inputPrimerAguaOxidacion: new FormControl('', ),
      inputSegundoAguaOxidacion: new FormControl('', ),
      inputTotalAguaOxidacion: new FormControl('', ),
      // ingreso Otros  
      inputTextoPrimerOtro: new FormControl(''),
      inputPrimerOtro: new FormControl(''),
      inputSegundoOtro: new FormControl(''),
      inputTotalOtro: new FormControl(''),
      // total ingresos
      inputTotalSumatoriaIngresos: new FormControl(''),

      /*EGRESOS*/
      // egresos orina
      inputPrimerOrina: new FormControl('', ),
      inputSegundoOrina: new FormControl('', ),
      inputTotalOrina: new FormControl('', ),

      inputPrimerVomito: new FormControl('', ),
      inputSegundoVomito: new FormControl('', ),
      inputTotalVomito: new FormControl('', ),

      inputPrimerAspiracion: new FormControl('', ),
      inputSegundoAspiracion: new FormControl('', ),
      inputTotalAspiracion: new FormControl('', ),

      inputTextoDrenaje: new FormControl('', ),
      inputPrimerDrenaje: new FormControl('', ),
      inputSegundoDrenaje: new FormControl('', ),
      inputTotalDrenaje: new FormControl('', ),

      inputPrimerPerdidaIncesante: new FormControl('', ),
      inputSegundoPerdidaIncesante: new FormControl('', ),
      inputTotalPerdidaIncesante: new FormControl('', ),

      inputPrimerDeposicion: new FormControl('', ),
      inputSegundoDeposicion: new FormControl('', ),
      inputTotalDeposicion: new FormControl('', ),

      inputTextoSegundoOtro: new FormControl(''),
      inputPrimerOtroEgreso: new FormControl(''),
      inputSegundoOtroEgreso: new FormControl(''),
      inputTotalOtroEgreso: new FormControl(''),

      inputTotalSumatoriaEgreso: new FormControl(''),

      inputBalanceHidrico: new FormControl(''),

      inputArrayIngreso: new FormControl(''),
      inputArrayEgresos: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.nombreUsuario = this.settingService.getUserSetting('nombres');
    this.apellidoUsuario =  this.settingService.getUserSetting('apellidos')
  }

  CerrarModal() {
    this.modalBalance.hide();
    //this.onGuardar();
  }

  get Controls() {
    return this.dataFormGroup.controls;
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){
    
    this.idHistoria = idHistoria;
    this.paciente = historia.cabeceraPaciente?.ApellidoPaterno+' '+historia.cabeceraPaciente?.ApellidoMaterno+', '+historia.cabeceraPaciente?.Nombre;
    this.medico = historia.MedicoAtiende?.ApellidoPaterno+' '+historia.MedicoAtiende?.ApellidoMaterno+', '+historia.MedicoAtiende?.Nombre;
    this.nroHcl = historia.cabeceraPaciente?.NumeroDocumento;
    this.objHistoria= historia;
    console.log("obj historia", historia);   
    let balance = new BalanceHidricoDTO();
    if(historia.BalanceHidrico != null)
    {
      balance.Paciente = historia.BalanceHidrico.Paciente;
      balance.Medico = historia.BalanceHidrico.Medico;
      balance.NroHcl = historia.BalanceHidrico.NroHcl;
      balance.Peso = historia.BalanceHidrico.Peso;
      balance.Talla = historia.BalanceHidrico.Talla;
      balance.IMC = historia.BalanceHidrico.IMC;
      balance.Tiempo = historia.BalanceHidrico.Tiempo;
      balance.Fecha = historia.BalanceHidrico.Fecha;
      balance.FechaTexto = historia.BalanceHidrico.FechaTexto;

      if(historia.BalanceHidrico.BalanceHidrico != null)
      {
        balance.BalanceHidrico = [];
        historia.BalanceHidrico.BalanceHidrico.forEach((element:any)=>{

          let item: any = historia.BalanceHidrico?.BalanceHidrico?.length;
          let hidrico = new BalanceHidricoTurnoDTO();
          hidrico.Item = ++item;
          hidrico.Fecha = element.Fecha;
          hidrico.FechaTexto = element.FechaTexto; 
          hidrico.DatosCompletos = element.DatosCompletos;  
          hidrico.BalanceHidrico = element.BalanceHidrico;

          hidrico.Ingreso = new BalanceHidricoIngresoDTO();
          hidrico.Ingreso.Oral = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.Oral.PrimerTurno = element.Ingreso.Oral.PrimerTurno;
          hidrico.Ingreso.Oral.SegundoTurno = element.Ingreso.Oral.SegundoTurno;
          hidrico.Ingreso.Oral.Total = element.Ingreso.Oral.Total;
          hidrico.Ingreso.ParentalTratamiento = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.ParentalTratamiento.PrimerTurno = element.Ingreso.ParentalTratamiento.PrimerTurno;
          hidrico.Ingreso.ParentalTratamiento.SegundoTurno = element.Ingreso.ParentalTratamiento.SegundoTurno;
          hidrico.Ingreso.ParentalTratamiento.Total = element.Ingreso.ParentalTratamiento.Total;
          hidrico.Ingreso.Sangre = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.Sangre.PrimerTurno = element.Ingreso.Sangre.PrimerTurno;
          hidrico.Ingreso.Sangre.SegundoTurno = element.Ingreso.Sangre.SegundoTurno;
          hidrico.Ingreso.Sangre.Total = element.Ingreso.Sangre.Total;
          hidrico.Ingreso.AguaOxidacion = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.AguaOxidacion.PrimerTurno = element.Ingreso.AguaOxidacion.PrimerTurno;
          hidrico.Ingreso.AguaOxidacion.SegundoTurno = element.Ingreso.AguaOxidacion.SegundoTurno;
          hidrico.Ingreso.AguaOxidacion.Total = element.Ingreso.AguaOxidacion.Total;
          hidrico.Ingreso.Otros = [];
          if (element.Ingreso.Otros != null) {
            element.Ingreso.Otros.forEach((dato: any) => {
              let item: any = hidrico.Ingreso?.Otros?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.Texto;
              otro.PrimerTurno = dato.PrimerTurno;
              otro.SegundoTurno = dato.SegundoTurno;
              otro.Total = dato.Total;
              hidrico.Ingreso?.Otros?.push(otro);
            });
          }
          hidrico.Ingreso.SumatoriaTotal = element.Ingreso.SumatoriaTotal;
          hidrico.Ingreso.Fecha = element.Ingreso.Fecha;
          hidrico.Ingreso.FechaTexto = element.Ingreso.FechaTexto;
          

          hidrico.Egreso = new BalanceHidricoEgresoDTO();
          hidrico.Egreso.Orina = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Orina.PrimerTurno = element.Egreso.Orina.PrimerTurno;
          hidrico.Egreso.Orina.SegundoTurno = element.Egreso.Orina.SegundoTurno;
          hidrico.Egreso.Orina.Total = element.Egreso.Orina.Total;
          hidrico.Egreso.Vomito = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Vomito.PrimerTurno = element.Egreso.Vomito.PrimerTurno;
          hidrico.Egreso.Vomito.SegundoTurno = element.Egreso.Vomito.SegundoTurno;
          hidrico.Egreso.Vomito.Total = element.Egreso.Vomito.Total;
          hidrico.Egreso.Aspiracion = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Aspiracion.PrimerTurno = element.Egreso.Aspiracion.PrimerTurno;
          hidrico.Egreso.Aspiracion.SegundoTurno = element.Egreso.Aspiracion.SegundoTurno;
          hidrico.Egreso.Aspiracion.Total = element.Egreso.Aspiracion.Total;
          hidrico.Egreso.Drenaje = [];
          if (element.Egreso.Drenaje != null) {
            element.Egreso.Drenaje.forEach((dato: any) => {
              let item: any = hidrico.Egreso?.Drenaje?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.Texto;
              otro.PrimerTurno = dato.PrimerTurno;
              otro.SegundoTurno = dato.SegundoTurno;
              otro.Total = dato.Total;
              hidrico.Egreso?.Drenaje?.push(otro);
            });
          }
          hidrico.Egreso.PerdidaIncesante = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.PerdidaIncesante.PrimerTurno = element.Egreso.PerdidaIncesante.PrimerTurno;
          hidrico.Egreso.PerdidaIncesante.SegundoTurno = element.Egreso.PerdidaIncesante.SegundoTurno;
          hidrico.Egreso.PerdidaIncesante.Total = element.Egreso.PerdidaIncesante.Total;
          hidrico.Egreso.Deposiciones = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Deposiciones.PrimerTurno = element.Egreso.Deposiciones.PrimerTurno;
          hidrico.Egreso.Deposiciones.SegundoTurno = element.Egreso.Deposiciones.SegundoTurno;
          hidrico.Egreso.Deposiciones.Total = element.Egreso.Deposiciones.Total;
          hidrico.Egreso.Otros = [];
          if (element.Egreso.otros != null) {
            element.Egreso.Otros.forEach((dato: any) => {
              let item: any = hidrico.Egreso?.Otros?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.Texto;
              otro.PrimerTurno = dato.PrimerTurno;
              otro.SegundoTurno = dato.SegundoTurno;
              otro.Total = dato.Total;
              hidrico.Egreso?.Otros?.push(otro);
            });
          }
          hidrico.Egreso.SumatoriaTotal = element.Egreso.SumatoriaTotal;
          hidrico.Egreso.Fecha = element.Egreso.Fecha;
          hidrico.Egreso.FechaTexto = element.Egreso.FechaTexto;

          balance.BalanceHidrico?.push(hidrico);
        });
        
      }
      
    }

    this.objBalanceHidrico = balance;
    this.AgregarValores(balance);
  
  }

  AgregarValores(objBalanceHidrico: BalanceHidricoDTO){

    let contar = Object.keys(objBalanceHidrico).length;
    if (contar != 0) {
      this.habilitarBotonImpresion = false;
      this.dataFormGroup.controls['inputPeso'].setValue(objBalanceHidrico.Peso);
      this.dataFormGroup.controls['inputTalla'].setValue(objBalanceHidrico.Talla);
      this.dataFormGroup.controls['inputImc'].setValue(objBalanceHidrico.IMC);
      this.dataFormGroup.controls['inputTiempo'].setValue(objBalanceHidrico.Tiempo);

      if (objBalanceHidrico.BalanceHidrico != null) {
        this.listadoBalanceHidrico = objBalanceHidrico.BalanceHidrico;
        let resultadoActualizar = objBalanceHidrico.BalanceHidrico.find(x => x.DatosCompletos == false);
        if (resultadoActualizar != null) {
          this.DeshabilitarTodosCampos();
          this.esActualizarBalanceHidrico = true;
          this.esItemActualizar = resultadoActualizar.Item;
          this.dataFormGroup.controls['inputPrimerOral'].setValue(resultadoActualizar.Ingreso?.Oral?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerParental'].setValue(resultadoActualizar.Ingreso?.Parental?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerParentalTratamiento'].setValue(resultadoActualizar.Ingreso?.ParentalTratamiento?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerSangre'].setValue(resultadoActualizar.Ingreso?.Sangre?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerAguaOxidacion'].setValue(resultadoActualizar.Ingreso?.AguaOxidacion?.PrimerTurno);

          this.dataFormGroup.controls['inputSegundoOral'].setValue(resultadoActualizar.Ingreso?.Oral?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoParental'].setValue(resultadoActualizar.Ingreso?.Parental?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoParentalTratamiento'].setValue(resultadoActualizar.Ingreso?.ParentalTratamiento?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoSangre'].setValue(resultadoActualizar.Ingreso?.Sangre?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoAguaOxidacion'].setValue(resultadoActualizar.Ingreso?.AguaOxidacion?.SegundoTurno);

          this.dataFormGroup.controls['inputTotalOral'].setValue(resultadoActualizar.Ingreso?.Oral?.Total);
          this.dataFormGroup.controls['inputTotalParental'].setValue(resultadoActualizar.Ingreso?.Parental?.Total);
          this.dataFormGroup.controls['inputTotalParentalTratamiento'].setValue(resultadoActualizar.Ingreso?.ParentalTratamiento?.Total);
          this.dataFormGroup.controls['inputTotalSangre'].setValue(resultadoActualizar.Ingreso?.Sangre?.Total);
          this.dataFormGroup.controls['inputTotalAguaOxidacion'].setValue(resultadoActualizar.Ingreso?.AguaOxidacion?.Total);
          
          resultadoActualizar.Ingreso?.Otros?.forEach(element => {
            this.listadoOtrosIngreso.push(element);
          });
          let sumatoriaIngresos = resultadoActualizar.Ingreso?.SumatoriaTotal??0;
          this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue(Number(sumatoriaIngresos).toFixed(2));

          this.dataFormGroup.controls['inputPrimerOrina'].setValue(resultadoActualizar.Egreso?.Orina?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerVomito'].setValue(resultadoActualizar.Egreso?.Vomito?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerAspiracion'].setValue(resultadoActualizar.Egreso?.Aspiracion?.PrimerTurno);

          this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].setValue(resultadoActualizar.Egreso?.PerdidaIncesante?.PrimerTurno);
          this.dataFormGroup.controls['inputPrimerDeposicion'].setValue(resultadoActualizar.Egreso?.Deposiciones?.PrimerTurno);

          this.dataFormGroup.controls['inputSegundoOrina'].setValue(resultadoActualizar.Egreso?.Orina?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoVomito'].setValue(resultadoActualizar.Egreso?.Vomito?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoAspiracion'].setValue(resultadoActualizar.Egreso?.Aspiracion?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].setValue(resultadoActualizar.Egreso?.PerdidaIncesante?.SegundoTurno);
          this.dataFormGroup.controls['inputSegundoDeposicion'].setValue(resultadoActualizar.Egreso?.Deposiciones?.SegundoTurno);

          this.dataFormGroup.controls['inputTotalOrina'].setValue(resultadoActualizar.Egreso?.Orina?.Total);
          this.dataFormGroup.controls['inputTotalVomito'].setValue(resultadoActualizar.Egreso?.Vomito?.Total);
          this.dataFormGroup.controls['inputTotalAspiracion'].setValue(resultadoActualizar.Egreso?.Aspiracion?.Total);

          this.dataFormGroup.controls['inputTotalPerdidaIncesante'].setValue(resultadoActualizar.Egreso?.PerdidaIncesante?.Total);
          this.dataFormGroup.controls['inputTotalDeposicion'].setValue(resultadoActualizar.Egreso?.Deposiciones?.Total);

          resultadoActualizar.Egreso?.Otros?.forEach(element => {
            this.listadoOtrosEgreso.push(element);
          });
          resultadoActualizar.Egreso?.Drenaje?.forEach(element => {
            this.listadoDrenaje.push(element);
          });

          let sumatoriaEgresos = resultadoActualizar.Egreso?.SumatoriaTotal??0;
          this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(sumatoriaEgresos);
        }

      }
      this.RestaBalanceHidrico();
      //this.listadoBalanceHidrico = this.OrdenarListaPorFechaNota(this.listadoBalanceHidrico);
    }
  }

  LimpiarDatos() {
    this.dataFormGroup.controls['inputPrimerOral'].setValue('');
    this.dataFormGroup.controls['inputPrimerParental'].setValue('');
    this.dataFormGroup.controls['inputPrimerParentalTratamiento'].setValue('');
    this.dataFormGroup.controls['inputPrimerSangre'].setValue('');
    this.dataFormGroup.controls['inputTextoPrimerOtro'].setValue('');
    this.dataFormGroup.controls['inputPrimerOtro'].setValue('');
    this.dataFormGroup.controls['inputPrimerAguaOxidacion'].setValue('');

    this.dataFormGroup.controls['inputSegundoOral'].setValue('');
    this.dataFormGroup.controls['inputSegundoParental'].setValue('');
    this.dataFormGroup.controls['inputSegundoParentalTratamiento'].setValue('');
    this.dataFormGroup.controls['inputSegundoSangre'].setValue('');
    this.dataFormGroup.controls['inputSegundoOtro'].setValue('');
    this.dataFormGroup.controls['inputSegundoAguaOxidacion'].setValue('');

    this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue('');

    this.dataFormGroup.controls['inputTotalOral'].setValue('');
    this.dataFormGroup.controls['inputTotalParental'].setValue('');
    this.dataFormGroup.controls['inputTotalParentalTratamiento'].setValue('');
    this.dataFormGroup.controls['inputTotalSangre'].setValue('');
    this.dataFormGroup.controls['inputTotalOtro'].setValue('');
    this.dataFormGroup.controls['inputTotalAguaOxidacion'].setValue('');
    this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue('');
    this.listadoOtrosIngreso = [];
  }

  LimpiarDatosEgresos() {
    this.dataFormGroup.controls['inputPrimerOrina'].setValue('');
    this.dataFormGroup.controls['inputPrimerVomito'].setValue('');
    this.dataFormGroup.controls['inputPrimerAspiracion'].setValue('');
    this.dataFormGroup.controls['inputTextoDrenaje'].setValue('');
    this.dataFormGroup.controls['inputPrimerDrenaje'].setValue('');
    this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].setValue('');
    this.dataFormGroup.controls['inputPrimerDeposicion'].setValue('');
    this.dataFormGroup.controls['inputTextoSegundoOtro'].setValue('');
    this.dataFormGroup.controls['inputPrimerOtroEgreso'].setValue('');
    this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue('');

    this.dataFormGroup.controls['inputSegundoOrina'].setValue('');
    this.dataFormGroup.controls['inputSegundoVomito'].setValue('');
    this.dataFormGroup.controls['inputSegundoAspiracion'].setValue('');
    this.dataFormGroup.controls['inputSegundoDrenaje'].setValue('');
    this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].setValue('');
    this.dataFormGroup.controls['inputSegundoDeposicion'].setValue('');
    this.dataFormGroup.controls['inputSegundoOtroEgreso'].setValue('');

    this.dataFormGroup.controls['inputTotalOrina'].setValue('')
    this.dataFormGroup.controls['inputTotalVomito'].setValue('')
    this.dataFormGroup.controls['inputTotalAspiracion'].setValue('')
    this.dataFormGroup.controls['inputTotalDrenaje'].setValue('')
    this.dataFormGroup.controls['inputTotalPerdidaIncesante'].setValue('')
    this.dataFormGroup.controls['inputTotalDeposicion'].setValue('')
    this.dataFormGroup.controls['inputTotalOtroEgreso'].setValue('')
    this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue('')
    this.listadoOtrosEgreso = [];
    this.listadoDrenaje = [];
  }

  DeshabilitarTodosCampos(){
    this.dataFormGroup.get('inputPrimerOral')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOral')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOral')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOral')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOral')?.clearValidators();
    this.dataFormGroup.get('inputTotalOral')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerParental')?.clearValidators();
    this.dataFormGroup.get('inputPrimerParental')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoParental')?.clearValidators();
    this.dataFormGroup.get('inputSegundoParental')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalParental')?.clearValidators();
    this.dataFormGroup.get('inputTotalParental')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerParentalTratamiento')?.clearValidators();
    this.dataFormGroup.get('inputPrimerParentalTratamiento')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoParentalTratamiento')?.clearValidators();
    this.dataFormGroup.get('inputSegundoParentalTratamiento')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalParentalTratamiento')?.clearValidators();
    this.dataFormGroup.get('inputTotalParentalTratamiento')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerSangre')?.clearValidators();
    this.dataFormGroup.get('inputPrimerSangre')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoSangre')?.clearValidators();
    this.dataFormGroup.get('inputSegundoSangre')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalSangre')?.clearValidators();
    this.dataFormGroup.get('inputTotalSangre')?.updateValueAndValidity();

    this.dataFormGroup.get('inputTextoPrimerOtro')?.clearValidators();
    this.dataFormGroup.get('inputTextoPrimerOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputPrimerOtro')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOtro')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOtro')?.clearValidators();
    this.dataFormGroup.get('inputTotalOtro')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerOrina')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOrina')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOrina')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOrina')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOrina')?.clearValidators();
    this.dataFormGroup.get('inputTotalOrina')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerVomito')?.clearValidators();
    this.dataFormGroup.get('inputPrimerVomito')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoVomito')?.clearValidators();
    this.dataFormGroup.get('inputSegundoVomito')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalVomito')?.clearValidators();
    this.dataFormGroup.get('inputTotalVomito')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerAspiracion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerAspiracion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoAspiracion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoAspiracion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalAspiracion')?.clearValidators();
    this.dataFormGroup.get('inputTotalAspiracion')?.updateValueAndValidity();

    this.dataFormGroup.get('inputTextoDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputTextoDrenaje')?.updateValueAndValidity();
    this.dataFormGroup.get('inputPrimerDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputPrimerDrenaje')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputSegundoDrenaje')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputTotalDrenaje')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerDeposicion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerDeposicion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoDeposicion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoDeposicion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalDeposicion')?.clearValidators();
    this.dataFormGroup.get('inputTotalDeposicion')?.updateValueAndValidity();

    this.dataFormGroup.get('inputTextoSegundoOtro')?.clearValidators();
    this.dataFormGroup.get('inputTextoSegundoOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputPrimerOtroEgreso')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOtroEgreso')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOtroEgreso')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOtroEgreso')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOtroEgreso')?.clearValidators();
    this.dataFormGroup.get('inputTotalOtroEgreso')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.updateValueAndValidity();

    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.updateValueAndValidity();
  }

  AgregarAmbosBalanceHidrico() {
    this.verErrorEgreso = false;
    this.verErrorIngreso = false;
    let item = this.listadoBalanceHidrico?.length;
    let balancehidrico = new BalanceHidricoTurnoDTO();
    balancehidrico.Fecha = moment().toDate();
    balancehidrico.FechaTexto = moment().format('YYYY-MM-DD HH:mm:ss');
    //INGRESOS
    let oral = (this.dataFormGroup.controls['inputPrimerOral'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerOral'].value) + '';
    let oral2 = (this.dataFormGroup.controls['inputSegundoOral'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoOral'].value) + '';
    let totalOral = this.dataFormGroup.controls['inputTotalOral'].value + ''
    let parental = (this.dataFormGroup.controls['inputPrimerParental'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerParental'].value) + '';
    let parental2 = (this.dataFormGroup.controls['inputSegundoParental'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoParental'].value) + '';
    let totalParental = this.dataFormGroup.controls['inputTotalParental'].value + ''
    let parentalTratamiento = (this.dataFormGroup.controls['inputPrimerParentalTratamiento'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerParentalTratamiento'].value) + '';
    let parentalTratamiento2 = (this.dataFormGroup.controls['inputSegundoParentalTratamiento'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoParentalTratamiento'].value) + '';
    let totalParentalTratamiento = this.dataFormGroup.controls['inputTotalParentalTratamiento'].value + ''
    let sangre = (this.dataFormGroup.controls['inputPrimerSangre'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerSangre'].value) + '';
    let sangre2 = (this.dataFormGroup.controls['inputSegundoSangre'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoSangre'].value) + '';
    let totalSangre = this.dataFormGroup.controls['inputTotalSangre'].value + '';
    let aguaOxidacion = (this.dataFormGroup.controls['inputPrimerAguaOxidacion'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerAguaOxidacion'].value) + '';
    let aguaOxidacion2 = (this.dataFormGroup.controls['inputSegundoAguaOxidacion'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoAguaOxidacion'].value) + '';
    let totalAguaOxidacion = this.dataFormGroup.controls['inputTotalAguaOxidacion'].value + ''

    let totalSumatoriaIngresos = (this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value == '' ? '' : this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value) + '';

    if (totalSumatoriaIngresos != null && totalSumatoriaIngresos != '') {
      balancehidrico.Ingreso = new BalanceHidricoIngresoDTO();
      balancehidrico.Ingreso.Oral = new BalanceHidricoDetalleDTO();
      balancehidrico.Ingreso.Oral.PrimerTurno = oral;
      balancehidrico.Ingreso.Oral.SegundoTurno = oral2;
      balancehidrico.Ingreso.Oral.Total = totalOral;
      balancehidrico.Ingreso.Parental = new BalanceHidricoDetalleDTO();
      balancehidrico.Ingreso.Parental.PrimerTurno = parental;
      balancehidrico.Ingreso.Parental.SegundoTurno = parental2;
      balancehidrico.Ingreso.Parental.Total = totalParental;
      balancehidrico.Ingreso.ParentalTratamiento = new BalanceHidricoDetalleDTO();
      balancehidrico.Ingreso.ParentalTratamiento.PrimerTurno = parentalTratamiento;
      balancehidrico.Ingreso.ParentalTratamiento.SegundoTurno = parentalTratamiento2;
      balancehidrico.Ingreso.ParentalTratamiento.Total = totalParentalTratamiento;
      balancehidrico.Ingreso.Sangre = new BalanceHidricoDetalleDTO();
      balancehidrico.Ingreso.Sangre.PrimerTurno = sangre;
      balancehidrico.Ingreso.Sangre.SegundoTurno = sangre2;
      balancehidrico.Ingreso.Sangre.Total = totalSangre;
      balancehidrico.Ingreso.AguaOxidacion = new BalanceHidricoDetalleDTO();
      balancehidrico.Ingreso.AguaOxidacion.PrimerTurno = aguaOxidacion;
      balancehidrico.Ingreso.AguaOxidacion.SegundoTurno = aguaOxidacion2;
      balancehidrico.Ingreso.AguaOxidacion.Total = totalAguaOxidacion;
      balancehidrico.Ingreso.Otros = this.listadoOtrosIngreso;
      balancehidrico.Ingreso.SumatoriaTotal = totalSumatoriaIngresos;
      balancehidrico.Ingreso.Fecha = moment().toDate();
      balancehidrico.Ingreso.FechaTexto = moment().format("YYYY-MM-DD HH:mm:ss");
      balancehidrico.BalanceHidrico = (this.dataFormGroup.controls['inputBalanceHidrico'].value == '' ? '' : this.dataFormGroup.controls['inputBalanceHidrico'].value).toString();
      this.LimpiarDatos();
    }
    else {
      this.verErrorIngreso = true;
      return;
    }

    //EGRESOS
    let orina = (this.dataFormGroup.controls['inputPrimerOrina'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerOrina'].value) + '';
    let orina2 = (this.dataFormGroup.controls['inputSegundoOrina'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoOrina'].value) + '';
    let totalOrina = this.dataFormGroup.controls['inputTotalOrina'].value + ''
    let vomito = (this.dataFormGroup.controls['inputPrimerVomito'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerVomito'].value) + '';
    let vomito2 = (this.dataFormGroup.controls['inputSegundoVomito'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoVomito'].value) + '';
    let totalVomito = this.dataFormGroup.controls['inputTotalVomito'].value + ''
    let aspiracion = (this.dataFormGroup.controls['inputPrimerAspiracion'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerAspiracion'].value) + '';
    let aspiracion2 = (this.dataFormGroup.controls['inputSegundoAspiracion'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoAspiracion'].value) + '';
    let totalAspiracion = this.dataFormGroup.controls['inputTotalAspiracion'].value + '';

    let perdidaIncesante = (this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].value) + '';
    let perdidaIncesante2 = (this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].value) + '';
    let totalPerdidaIncesante = this.dataFormGroup.controls['inputTotalPerdidaIncesante'].value + '';
    let deposicion = (this.dataFormGroup.controls['inputPrimerDeposicion'].value == '' ? '' : this.dataFormGroup.controls['inputPrimerDeposicion'].value) + '';
    let deposicion2 = (this.dataFormGroup.controls['inputSegundoDeposicion'].value == '' ? '' : this.dataFormGroup.controls['inputSegundoDeposicion'].value) + '';
    let totalDeposiciones = this.dataFormGroup.controls['inputTotalDeposicion'].value + ''
    let totalSumatoriaEgreso = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value + ''

    if (totalSumatoriaEgreso != null && totalSumatoriaEgreso != '') {
      balancehidrico.Egreso = new BalanceHidricoEgresoDTO();
      balancehidrico.Egreso.Orina = new BalanceHidricoDetalleDTO();
      balancehidrico.Egreso.Orina.PrimerTurno = orina;
      balancehidrico.Egreso.Orina.SegundoTurno = orina2;
      balancehidrico.Egreso.Orina.Total = totalOrina;
      balancehidrico.Egreso.Vomito = new BalanceHidricoDetalleDTO();
      balancehidrico.Egreso.Vomito.PrimerTurno = vomito;
      balancehidrico.Egreso.Vomito.SegundoTurno = vomito2;
      balancehidrico.Egreso.Vomito.Total = totalVomito;
      balancehidrico.Egreso.Aspiracion = new BalanceHidricoDetalleDTO();
      balancehidrico.Egreso.Aspiracion.PrimerTurno = aspiracion;
      balancehidrico.Egreso.Aspiracion.SegundoTurno = aspiracion2;
      balancehidrico.Egreso.Aspiracion.Total = totalAspiracion;
      balancehidrico.Egreso.Drenaje = this.listadoDrenaje;
      balancehidrico.Egreso.PerdidaIncesante = new BalanceHidricoDetalleDTO();
      balancehidrico.Egreso.PerdidaIncesante.PrimerTurno = perdidaIncesante;
      balancehidrico.Egreso.PerdidaIncesante.SegundoTurno = perdidaIncesante2;
      balancehidrico.Egreso.PerdidaIncesante.Total = totalPerdidaIncesante;
      balancehidrico.Egreso.Deposiciones = new BalanceHidricoDetalleDTO();
      balancehidrico.Egreso.Deposiciones.PrimerTurno = deposicion;
      balancehidrico.Egreso.Deposiciones.SegundoTurno = deposicion2;
      balancehidrico.Egreso.Deposiciones.Total = totalDeposiciones;
      balancehidrico.Egreso.Otros = this.listadoOtrosEgreso;
      balancehidrico.Egreso.SumatoriaTotal = totalSumatoriaEgreso;
      balancehidrico.Egreso.Fecha = moment().toDate();
      balancehidrico.Egreso.FechaTexto = moment().format("YYYY-MM-DD HH:mm:ss");
      this.LimpiarDatosEgresos();
    }
    else {
      this.verErrorEgreso = true;
      return;
    }

    let verificarIngresoPrimerTurno: boolean = true;
    let verificarIngresoSegundoTurno: boolean = true;
    let verificarEgresoPrimerTurno: boolean = true;
    let verificarEgresoSegundoTurno: boolean = true;

  if (balancehidrico.Ingreso?.AguaOxidacion?.PrimerTurno === '') 
  { verificarIngresoPrimerTurno = false; }

    if (balancehidrico.Ingreso?.AguaOxidacion?.SegundoTurno === '') 
    {verificarIngresoSegundoTurno = false; }

    if (balancehidrico.Egreso?.PerdidaIncesante?.PrimerTurno === '') 
    { verificarEgresoPrimerTurno = false; }

    if (balancehidrico.Egreso?.PerdidaIncesante?.SegundoTurno === '')
    { verificarEgresoSegundoTurno = false; }

    let verificarIngresoOtros = balancehidrico.Ingreso?.Otros?.find(x => x.PrimerTurno === '' || x.SegundoTurno === '');
    let verificarEgresoOtros = balancehidrico.Egreso?.Otros?.find(x => x.PrimerTurno === '' || x.SegundoTurno === '');
    let verificarEgresoDrenaje = balancehidrico.Egreso?.Drenaje?.find(x => x.PrimerTurno === '' || x.SegundoTurno === '');
    
    if (verificarIngresoPrimerTurno && verificarIngresoSegundoTurno && verificarEgresoPrimerTurno  && verificarEgresoSegundoTurno) 
    { balancehidrico.DatosCompletos = true; }
    else 
    { balancehidrico.DatosCompletos = false; }
    
    if (this.esActualizarBalanceHidrico) {
      this.esActualizarBalanceHidrico = false;
      let listadoTemporal = this.listadoBalanceHidrico;
      this.listadoBalanceHidrico = [];
      listadoTemporal.forEach(element => {
        if (element.Item != this.esItemActualizar) {
          element.Item = ++item;
          this.listadoBalanceHidrico.unshift(element);
        }
        else {
          balancehidrico.Item = this.esItemActualizar;
          this.listadoBalanceHidrico.unshift(balancehidrico);
          this.esItemActualizar = undefined;
        }
      });
    }
    else {
      balancehidrico.Item = ++item;
      this.listadoBalanceHidrico.unshift(balancehidrico);
    }

    console.log(this.listadoBalanceHidrico);
  }

  SumarIngresosOral() {
    let primero = this.dataFormGroup.controls['inputPrimerOral'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoOral'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalOral'].setValue(suma);
    this.SumaTotalIngresos();
    this.dataFormGroup.get('inputPrimerOral')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOral')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOral')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOral')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOral')?.clearValidators();
    this.dataFormGroup.get('inputTotalOral')?.updateValueAndValidity();
  }

  SumarIngresosParental() {
    let primero = this.dataFormGroup.controls['inputPrimerParental'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoParental'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalParental'].setValue(suma);
    this.SumaTotalIngresos();
    this.dataFormGroup.get('inputPrimerParental')?.clearValidators();
    this.dataFormGroup.get('inputPrimerParental')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoParental')?.clearValidators();
    this.dataFormGroup.get('inputSegundoParental')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalParental')?.clearValidators();
    this.dataFormGroup.get('inputTotalParental')?.updateValueAndValidity();
  }

  SumarIngresosParentalTratamiento() {
    let primero = this.dataFormGroup.controls['inputPrimerParentalTratamiento'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoParentalTratamiento'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalParentalTratamiento'].setValue(suma);
    this.SumaTotalIngresos();
    this.dataFormGroup.get('inputPrimerParentalTratamiento')?.clearValidators();
    this.dataFormGroup.get('inputPrimerParentalTratamiento')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoParentalTratamiento')?.clearValidators();
    this.dataFormGroup.get('inputSegundoParentalTratamiento')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalParentalTratamiento')?.clearValidators();
    this.dataFormGroup.get('inputTotalParentalTratamiento')?.updateValueAndValidity();
  }

  SumarIngresosSangre() {
    let primero = this.dataFormGroup.controls['inputPrimerSangre'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoSangre'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalSangre'].setValue(suma);
    this.SumaTotalIngresos();
    this.dataFormGroup.get('inputPrimerSangre')?.clearValidators();
    this.dataFormGroup.get('inputPrimerSangre')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoSangre')?.clearValidators();
    this.dataFormGroup.get('inputSegundoSangre')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalSangre')?.clearValidators();
    this.dataFormGroup.get('inputTotalSangre')?.updateValueAndValidity();
  }

  SumarIngresosOtro() {
    let primero = this.dataFormGroup.controls['inputPrimerOtro'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoOtro'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalOtro'].setValue(suma);
    this.dataFormGroup.get('inputTextoPrimerOtro')?.clearValidators();
    this.dataFormGroup.get('inputTextoPrimerOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputPrimerOtro')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOtro')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOtro')?.clearValidators();
    this.dataFormGroup.get('inputTotalOtro')?.updateValueAndValidity();
  }

  PrimerIngresosAguaOxidacion() {
    let resultado = this.CalcularAguaOxidacion();
    this.dataFormGroup.controls['inputPrimerAguaOxidacion'].setValue(resultado.toFixed(2));
    let suma = Number(this.dataFormGroup.controls['inputPrimerAguaOxidacion'].value) + Number(this.dataFormGroup.controls['inputSegundoAguaOxidacion'].value);
    this.dataFormGroup.controls['inputTotalAguaOxidacion'].setValue(suma.toFixed(2));
    this.SumaTotalIngresos();
    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.updateValueAndValidity();
  }

  SegundoIngresosAguaOxidacion() {
    let resultado = this.CalcularAguaOxidacion();
    this.dataFormGroup.controls['inputSegundoAguaOxidacion'].setValue(resultado.toFixed(2));
    let suma = Number(this.dataFormGroup.controls['inputPrimerAguaOxidacion'].value) + Number(this.dataFormGroup.controls['inputSegundoAguaOxidacion'].value);
    this.dataFormGroup.controls['inputTotalAguaOxidacion'].setValue(suma.toFixed(2));
    this.SumaTotalIngresos();
    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoAguaOxidacion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.clearValidators();
    this.dataFormGroup.get('inputTotalAguaOxidacion')?.updateValueAndValidity();
  }

  SumaTotalIngresos() {
    let oral = this.dataFormGroup.controls['inputTotalOral'].value;
    let parental = this.dataFormGroup.controls['inputTotalParental'].value;    
    let otro = this.dataFormGroup.controls['inputTotalOtro'].value;
    let aguaOxidacion = this.dataFormGroup.controls['inputTotalAguaOxidacion'].value;
    let parentalTratamiento = this.dataFormGroup.controls['inputTotalParentalTratamiento'].value;
    let sangre = this.dataFormGroup.controls['inputTotalSangre'].value;
    //let suma = Number(oral) + Number(parental) + Number(sangre) + Number(otro) + Number(aguaOxidacion);
    let suma = Number(oral) + Number(parental) + Number(sangre) + Number(aguaOxidacion) + Number(otro) + Number(parentalTratamiento);
    this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue(suma.toFixed(2));
    this.RestaBalanceHidrico();
  }

  SumarEgresosOrina() {
    let primero = this.dataFormGroup.controls['inputPrimerOrina'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoOrina'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalOrina'].setValue(suma);
    this.SumaTotalEgresos();
    this.dataFormGroup.get('inputPrimerOrina')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOrina')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOrina')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOrina')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOrina')?.clearValidators();
    this.dataFormGroup.get('inputTotalOrina')?.updateValueAndValidity();
  }

  SumarEgresosVomito() {
    let primero = this.dataFormGroup.controls['inputPrimerVomito'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoVomito'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalVomito'].setValue(suma);
    this.SumaTotalEgresos();
    this.dataFormGroup.get('inputPrimerVomito')?.clearValidators();
    this.dataFormGroup.get('inputPrimerVomito')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoVomito')?.clearValidators();
    this.dataFormGroup.get('inputSegundoVomito')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalVomito')?.clearValidators();
    this.dataFormGroup.get('inputTotalVomito')?.updateValueAndValidity();
  }

  SumarEgresosAspiracion() {
    let primero = this.dataFormGroup.controls['inputPrimerAspiracion'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoAspiracion'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalAspiracion'].setValue(suma);
    this.SumaTotalEgresos();
    this.dataFormGroup.get('inputPrimerAspiracion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerAspiracion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoAspiracion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoAspiracion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalAspiracion')?.clearValidators();
    this.dataFormGroup.get('inputTotalAspiracion')?.updateValueAndValidity();
  }

  SumarEgresosDrenaje() {
    let primero = this.dataFormGroup.controls['inputPrimerDrenaje'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoDrenaje'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalDrenaje'].setValue(suma);
    //this.SumaTotalEgresos();
    this.dataFormGroup.get('inputTextoDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputTextoDrenaje')?.updateValueAndValidity();
    this.dataFormGroup.get('inputPrimerDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputPrimerDrenaje')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputSegundoDrenaje')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalDrenaje')?.clearValidators();
    this.dataFormGroup.get('inputTotalDrenaje')?.updateValueAndValidity();
  }

  SumarEgresosDeposicion() {
    let primero = this.dataFormGroup.controls['inputPrimerDeposicion'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoDeposicion'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalDeposicion'].setValue(suma);
    this.SumaTotalEgresos();
    this.dataFormGroup.get('inputPrimerDeposicion')?.clearValidators();
    this.dataFormGroup.get('inputPrimerDeposicion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoDeposicion')?.clearValidators();
    this.dataFormGroup.get('inputSegundoDeposicion')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalDeposicion')?.clearValidators();
    this.dataFormGroup.get('inputTotalDeposicion')?.updateValueAndValidity();
  }

  SumarEgresosOtro() {
    let primero = this.dataFormGroup.controls['inputPrimerOtroEgreso'].value;
    let segundo = this.dataFormGroup.controls['inputSegundoOtroEgreso'].value;
    let suma = Number(primero) + Number(segundo);
    this.dataFormGroup.controls['inputTotalOtroEgreso'].setValue(suma);
    //this.SumaTotalEgresos();
    this.dataFormGroup.get('inputTextoSegundoOtro')?.clearValidators();
    this.dataFormGroup.get('inputTextoSegundoOtro')?.updateValueAndValidity();
    this.dataFormGroup.get('inputPrimerOtroEgreso')?.clearValidators();
    this.dataFormGroup.get('inputPrimerOtroEgreso')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoOtroEgreso')?.clearValidators();
    this.dataFormGroup.get('inputSegundoOtroEgreso')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalOtroEgreso')?.clearValidators();
    this.dataFormGroup.get('inputTotalOtroEgreso')?.updateValueAndValidity();
  }

  PrimerEgresoPerdidaIncesante() {
    let resultado = this.CalcularPerdidaInsensible();
    this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].setValue(resultado.toFixed(2));
    let suma = Number(this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].value) + Number(this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].value);
    this.dataFormGroup.controls['inputTotalPerdidaIncesante'].setValue(suma.toFixed(2));
    this.SumaTotalEgresos();
    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.updateValueAndValidity();
  }

  SegundoEgresoPerdidaIncesante() {
    let resultado = this.CalcularPerdidaInsensible();
    this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].setValue(resultado.toFixed(2));
    let suma = Number(this.dataFormGroup.controls['inputPrimerPerdidaIncesante'].value) + Number(this.dataFormGroup.controls['inputSegundoPerdidaIncesante'].value);
    this.dataFormGroup.controls['inputTotalPerdidaIncesante'].setValue(suma.toFixed(2));
    this.SumaTotalEgresos();
    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputPrimerPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputSegundoPerdidaIncesante')?.updateValueAndValidity();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.clearValidators();
    this.dataFormGroup.get('inputTotalPerdidaIncesante')?.updateValueAndValidity();
  }

  SumaTotalEgresos() {
    let orina = this.dataFormGroup.controls['inputTotalOrina'].value;
    let vomito = this.dataFormGroup.controls['inputTotalVomito'].value;
    let aspiracion = this.dataFormGroup.controls['inputTotalAspiracion'].value;
    //let drenaje = this.dataFormGroup.controls['inputTotalDrenaje'].value;
    let deposicion = this.dataFormGroup.controls['inputTotalDeposicion'].value;
    //let otros = this.dataFormGroup.controls['inputTotalOtroEgreso'].value;
    let perdidaIncesante = this.dataFormGroup.controls['inputTotalPerdidaIncesante'].value;
    let drenaje = 0;
    let otros = 0;
    this.listadoDrenaje.forEach(element => {
      drenaje += Number(element.Total);
    });
    this.listadoOtrosEgreso.forEach(element => {
      otros += Number(element.Total);
    });

    let suma = Number(orina) + Number(vomito) + Number(aspiracion) + Number(drenaje) + Number(deposicion) + Number(otros) + Number(perdidaIncesante);

    this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));

    this.RestaBalanceHidrico();
  }


  RestaBalanceHidrico() {
    let sumaIngresos = this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value;
    let sumaEgresos = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
    if (sumaIngresos != '' && sumaEgresos != '') {
      let suma = (Number(sumaIngresos) - Number(sumaEgresos)).toFixed(2);
      this.dataFormGroup.controls['inputBalanceHidrico'].setValue(suma);
    }
  }
  EliminarBalanceHidricoAmbos(item: number) {
    let nuevoItem = 0;
    let temporalListadoDTO = this.listadoBalanceHidrico;
    this.listadoBalanceHidrico = [];
    temporalListadoDTO?.forEach(element => {
      if (element.Item != item) {
        element.Item = nuevoItem++;
        this.listadoBalanceHidrico?.push(element);
      }
    });
  }

  VerListaIngresosyEgresos(item: number) {
    this.esItemVisualizar = item;
    this.verListaIngresosEgresos = !this.verListaIngresosEgresos;
  }

  CalcularIndiceMasaCorporal() {
    let peso = this.dataFormGroup.controls['inputPeso'].value;
    let talla = this.dataFormGroup.controls['inputTalla'].value;
    //var nuevaTalla=talla.replace(",",".");
    if (peso != null && talla != null) {
      this.IMC = peso / (talla * talla);
      this.dataFormGroup.controls['inputImc'].setValue((this.IMC).toFixed(1));
    }
  }

  AgregarOtrosIngresos() {
    if (this.itemIngresoOtros.hasOwnProperty('PrimerTurno')) {
      this.listadoOtrosIngreso.forEach(element => {
        if (element.Item == this.itemIngresoOtros.Item) {
          element.Texto = this.dataFormGroup.controls['inputTextoPrimerOtro'].value + '';
          element.PrimerTurno = this.dataFormGroup.controls['inputPrimerOtro'].value.toString();
          element.SegundoTurno = this.dataFormGroup.controls['inputSegundoOtro'].value.toString();
          element.Total = this.dataFormGroup.controls['inputTotalOtro'].value.toString();
          let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value;
          let suma = Number(sumaTotal) + Number(element.Total);
          this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue(suma.toFixed(2));
        }
      });
      this.itemIngresoOtros = new BalanceHidricoDetalleDTO();
    }
    else {
      let item = this.listadoOtrosIngreso.length;
      let texto = this.dataFormGroup.controls['inputTextoPrimerOtro'].value.toString();
      let primero = this.dataFormGroup.controls['inputPrimerOtro'].value.toString();
      let segundo = this.dataFormGroup.controls['inputSegundoOtro'].value.toString();
      let total = this.dataFormGroup.controls['inputTotalOtro'].value.toString();
      if (primero != '' || segundo != '') {
        let otro = new BalanceHidricoDetalleDTO();
        otro.Item = ++item;
        otro.Texto = texto;
        otro.PrimerTurno = primero;
        otro.SegundoTurno = segundo;
        otro.Total = total;
        this.listadoOtrosIngreso.push(otro);

        let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value;
        let suma = Number(sumaTotal) + Number(total);
        this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue(suma.toFixed(2));
      }
    }

    this.RestaBalanceHidrico();

    this.dataFormGroup.controls['inputTextoPrimerOtro'].setValue('');
    this.dataFormGroup.controls['inputPrimerOtro'].setValue('');
    this.dataFormGroup.controls['inputSegundoOtro'].setValue('');
    this.dataFormGroup.controls['inputTotalOtro'].setValue('');
  }

  EliminarOtrosIngresos(item: number) {
    let nuevoItem = 0;
    let temporalListadoDTO = this.listadoOtrosIngreso;
    this.listadoOtrosIngreso = [];
    temporalListadoDTO?.forEach(element => {
      if (element.Item != item) {
        element.Item = nuevoItem++;
        this.listadoOtrosIngreso?.push(element);
      }
      else {
        let total = element.Total;
        let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value;
        let suma = Number(sumaTotal) - Number(total);
        this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue(suma);
        this.RestaBalanceHidrico();
      }
    });
  }

  AgregarOtrosEgresos() {
    if (this.itemEgresoOtros.hasOwnProperty('PrimerTurno')) {
      this.listadoOtrosEgreso.forEach(element => {
        if (element.Item == this.itemEgresoOtros.Item) {
          element.Texto = this.dataFormGroup.controls['inputTextoSegundoOtro'].value.toString();
          element.PrimerTurno = this.dataFormGroup.controls['inputPrimerOtroEgreso'].value.toString();
          element.SegundoTurno = this.dataFormGroup.controls['inputSegundoOtroEgreso'].value.toString();
          element.Total = this.dataFormGroup.controls['inputTotalOtroEgreso'].value.toString();
          let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
          let suma = Number(sumaTotal) + Number(element.Total);
          this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
        }
      });
      this.itemEgresoOtros = new BalanceHidricoDetalleDTO();
    }
    else {
      let item = this.listadoOtrosEgreso.length;
      let texto = this.dataFormGroup.controls['inputTextoSegundoOtro'].value.toString();
      let primero = this.dataFormGroup.controls['inputPrimerOtroEgreso'].value.toString();
      let segundo = this.dataFormGroup.controls['inputSegundoOtroEgreso'].value.toString();
      let total = this.dataFormGroup.controls['inputTotalOtroEgreso'].value.toString();
      if (primero != '' || segundo != '') {
        let otro = new BalanceHidricoDetalleDTO();
        otro.Item = ++item;
        otro.Texto = texto;
        otro.PrimerTurno = primero;
        otro.SegundoTurno = segundo;
        otro.Total = total;
        this.listadoOtrosEgreso.push(otro);

        let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
        let suma = Number(sumaTotal) + Number(total);
        this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
      }
    }
    this.RestaBalanceHidrico();

    this.dataFormGroup.controls['inputTextoSegundoOtro'].setValue('');
    this.dataFormGroup.controls['inputPrimerOtroEgreso'].setValue('');
    this.dataFormGroup.controls['inputSegundoOtroEgreso'].setValue('');
    this.dataFormGroup.controls['inputTotalOtroEgreso'].setValue('');
  }

  ActualizarOtrosIngresos(lista: BalanceHidricoDetalleDTO) {
    this.itemIngresoOtros = lista;
    this.dataFormGroup.controls['inputTextoPrimerOtro'].setValue(lista.Texto);
    this.dataFormGroup.controls['inputPrimerOtro'].setValue(lista.PrimerTurno);
    this.dataFormGroup.controls['inputSegundoOtro'].setValue(lista.SegundoTurno);
    this.dataFormGroup.controls['inputTotalOtro'].setValue(lista.Total);
    let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].value;
    let suma = Number(sumaTotal) - Number(this.itemIngresoOtros.Total);
    this.dataFormGroup.controls['inputTotalSumatoriaIngresos'].setValue(suma.toFixed(2));
  }

  EliminarOtrosEgresos(item: number) {
    let nuevoItem = 0;
    let temporalListadoDTO = this.listadoOtrosEgreso;
    this.listadoOtrosEgreso = [];
    temporalListadoDTO?.forEach(element => {
      if (element.Item != item) {
        element.Item = nuevoItem++;
        this.listadoOtrosEgreso?.push(element);
      }
      else {
        let total = element.Total;
        let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
        let suma = Number(sumaTotal) - Number(total);
        this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
        this.RestaBalanceHidrico();
      }
    });
  }

  ActualizarOtrosEgresos(lista: BalanceHidricoDetalleDTO) {
    this.itemEgresoOtros = lista;
    this.dataFormGroup.controls['inputTextoSegundoOtro'].setValue(lista.Texto);
    this.dataFormGroup.controls['inputPrimerOtroEgreso'].setValue(lista.PrimerTurno);
    this.dataFormGroup.controls['inputSegundoOtroEgreso'].setValue(lista.SegundoTurno);
    this.dataFormGroup.controls['inputTotalOtroEgreso'].setValue(lista.Total);
    let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
    let suma = Number(sumaTotal) - Number(this.itemEgresoOtros.Total);
    this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
  }

  AgregarDrenajeEgresos() {
    if (this.itemDrenaje.hasOwnProperty('PrimerTurno')) {
      this.listadoDrenaje.forEach(element => {
        if (element.Item == this.itemDrenaje.Item) {
          element.Texto = this.dataFormGroup.controls['inputTextoDrenaje'].value.toString();
          element.PrimerTurno = this.dataFormGroup.controls['inputPrimerDrenaje'].value.toString();
          element.SegundoTurno = this.dataFormGroup.controls['inputSegundoDrenaje'].value.toString();
          element.Total = this.dataFormGroup.controls['inputTotalDrenaje'].value.toString();
          let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
          let suma = Number(sumaTotal) + Number(element.Total);
          this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
        }
      });
      this.itemDrenaje = new BalanceHidricoDetalleDTO();
    }
    else {
      let item = this.listadoDrenaje.length;
      let texto = this.dataFormGroup.controls['inputTextoDrenaje'].value.toString();
      let primero = this.dataFormGroup.controls['inputPrimerDrenaje'].value.toString();
      let segundo = this.dataFormGroup.controls['inputSegundoDrenaje'].value.toString();
      let total = this.dataFormGroup.controls['inputTotalDrenaje'].value.toString();
      if (primero != '' || segundo != '') {
        let otro = new BalanceHidricoDetalleDTO();
        otro.Item = ++item;
        otro.Texto = texto;
        otro.PrimerTurno = primero;
        otro.SegundoTurno = segundo;
        otro.Total = total;
        this.listadoDrenaje.push(otro);
        let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
        let suma = Number(sumaTotal) + Number(total);
        this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
      }
    }
    this.RestaBalanceHidrico();
    this.dataFormGroup.controls['inputTextoDrenaje'].setValue('');
    this.dataFormGroup.controls['inputPrimerDrenaje'].setValue('');
    this.dataFormGroup.controls['inputSegundoDrenaje'].setValue('');
    this.dataFormGroup.controls['inputTotalDrenaje'].setValue('');
  }

  EliminarDrenaje(item: number) {
    let nuevoItem = 0;
    let temporalListadoDTO = this.listadoDrenaje;
    this.listadoDrenaje = [];
    temporalListadoDTO?.forEach(element => {
      if (element.Item != item) {
        element.Item = nuevoItem++;
        this.listadoDrenaje?.push(element);
      }
      else {
        let total = element.Total;
        let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
        let suma = Number(sumaTotal) - Number(total);
        this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
        this.RestaBalanceHidrico();
      }
    });
  }

  ActualizarDrenaje(lista: BalanceHidricoDetalleDTO) {
    this.itemDrenaje = lista;
    this.dataFormGroup.controls['inputTextoDrenaje'].setValue(lista.Texto);
    this.dataFormGroup.controls['inputPrimerDrenaje'].setValue(lista.PrimerTurno);
    this.dataFormGroup.controls['inputSegundoDrenaje'].setValue(lista.SegundoTurno);
    this.dataFormGroup.controls['inputTotalDrenaje'].setValue(lista.Total);
    let sumaTotal = this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].value;
    let suma = Number(sumaTotal) - Number(this.itemDrenaje.Total);
    this.dataFormGroup.controls['inputTotalSumatoriaEgreso'].setValue(suma.toFixed(2));
  }

  OrdenarListaPorFechaNota(lista:any) {
    lista.sort(function (a: any, b: any) {
      if (a.Fecha > b.Fecha) { return -1; }
      if (a.Fecha < b.Fecha) { return 1; }
      return 0;
    });
    return lista;
  }

  CalcularAguaOxidacion():number {
    let aguaOxidacion:number = 0;
    let perdidaInsensible:number = 0;

    let peso = this.dataFormGroup.controls['inputPeso'].value;
    let tiempo = this.dataFormGroup.controls['inputTiempo'].value;
    if(tiempo == '' ){
      this.MostrarNotificacionWarning('No ingreso tiempo para hacer el calculo', '');
    }

    // Paciente pediatrico menor 14 años y peso menor a 10 años
    if (Number(peso) < 10 && this.edadPaciente <= 14) {
      perdidaInsensible = Number(peso) * 40;
      aguaOxidacion = (perdidaInsensible / 3)  * (tiempo / 3);
    } // Paciente pediatrico menor 14 años y peso mayor a 10 años
    else if (Number(peso) > 10 && this.edadPaciente <= 14) {
      let superficieCorporal = ((Number(peso) * 4) + 7) / (Number(peso) + 90);
      perdidaInsensible = Number(superficieCorporal) * 400;
      aguaOxidacion = (perdidaInsensible / 3) * (tiempo / 3);
    } // Paciente no pediatrico
    else{
      aguaOxidacion = ((Number(peso) * 0.5) * (tiempo / 3));
    }
    return aguaOxidacion;
  }

  CalcularPerdidaInsensible():number {
    let perdidaInsensible:number = 0;
    let aguaOxidacion = 0;
    // Variables de IMC
    let peso = this.dataFormGroup.controls['inputPeso'].value;
    let tiempo = this.dataFormGroup.controls['inputTiempo'].value;

    if(tiempo == '') {
      this.MostrarNotificacionWarning('No ingreso tiempo para hacer el calculo', '');
    }

    // Paciente pediatrico menor 14 años y peso menor a 10 años
    if (Number(peso) < 10 && this.edadPaciente <= 14) {
      perdidaInsensible = ((Number(peso) * 40) * 0.5) * tiempo;
      let suma = Number(this.dataFormGroup.controls['inputPrimerAguaOxidacion'].value) + Number(this.dataFormGroup.controls['inputSegundoAguaOxidacion'].value);
      this.dataFormGroup.controls['inputTotalAguaOxidacion'].setValue(suma.toFixed(2));
      this.SumaTotalIngresos();
    } // Paciente pediatrico menor 14 años y peso mayor a 10 años
    else if (Number(peso) > 10 && this.edadPaciente <= 14) {
      let superficieCorporal = ((Number(peso) * 4) + 7) / (Number(peso) + 90);
      perdidaInsensible = ((Number(superficieCorporal) * 400) * 0.5) * tiempo;
      aguaOxidacion = perdidaInsensible / 3;
      let suma = Number(this.dataFormGroup.controls['inputPrimerAguaOxidacion'].value) + Number(this.dataFormGroup.controls['inputSegundoAguaOxidacion'].value);
      this.dataFormGroup.controls['inputTotalAguaOxidacion'].setValue(suma.toFixed(2));
      this.SumaTotalIngresos();
    } // Paciente no pediatrico
    else { 
      perdidaInsensible = (Number(peso) * 0.5) * tiempo;
    }
    return perdidaInsensible;
  }

  Guardar(){
    for (let c in this.dataFormGroup.controls) {
      this.dataFormGroup.controls[c].markAsTouched();
    }
    if (this.listadoBalanceHidrico.length <= 0) {
      this.MostrarNotificacionInfo('Agregar registro y completar campos', 'Error')
      return;
    }

    if (this.dataFormGroup.valid) {
      let balanceHidrico = new BalanceHidricoDTO();
      balanceHidrico = this.AsignarValoresADTO();
      this.objHistoria.IdHistoriaClinica = this.idHistoria;
      this.objHistoria.BalanceHidrico = balanceHidrico;
      console.log("hc guardar", this.objHistoria);
      this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
        next: (data) => {
          this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
          //this.CerrarModal();
        },
        error: (e) => {
          console.log('Error: ', e);
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      });
    }
    else {
      this.MostrarNotificacionError('Hay campos obligatorios', '¡Error en el proceso!')
    }
  }

  AsignarValoresADTO() {


    let balanceHidrico = new BalanceHidricoDTO();

    balanceHidrico.Paciente = this.paciente;
    balanceHidrico.Medico = this.medico;
    balanceHidrico.NroHcl = this.nroHcl;
    balanceHidrico.Peso = this.dataFormGroup.controls['inputPeso'].value;
    balanceHidrico.Talla = this.dataFormGroup.controls['inputTalla'].value;
    balanceHidrico.IMC = this.dataFormGroup.controls['inputImc'].value;
    balanceHidrico.Tiempo = this.dataFormGroup.controls['inputTiempo'].value;
    balanceHidrico.Fecha = moment().toDate();
    balanceHidrico.FechaTexto = moment().format("YYYY-MM-DD HH:mm:ss");

    balanceHidrico.BalanceHidrico = [];
    if (Array.isArray(this.listadoBalanceHidrico)) {
      this.listadoBalanceHidrico.forEach(element => {
        balanceHidrico.BalanceHidrico?.push(element)
      });
    }
    return balanceHidrico;
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
  manejadorMensajeErroresGuardar(e: any) {
    if (typeof e != "string") {
      let error = e;
      let arrayErrores: any[] = [];
      let errorValidacion = Object.keys(e);
      if (Array.isArray(errorValidacion)) {
        errorValidacion.forEach((propiedadConError: any) => {
          error[propiedadConError].forEach((mensajeError: any) => {
            if (!arrayErrores.includes(mensajeError['mensaje'])) {
              arrayErrores.push(mensajeError['mensaje']);
            }
          });
        });
        this.MostrarNotificacionError(arrayErrores.join("<br/>"), '¡ERROR EN EL PROCESO!')
      } else {
        this.MostrarNotificacionError("", '¡ERROR EN EL PROCESO!')
      }
    }
    else {
      this.MostrarNotificacionError(e, '¡ERROR EN EL PROCESO!');
    }
  }

  MostrarNotificacionError(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      html: `<div class="message-text-error">${mensaje} </div>`,
    });
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
    this.CerrarModal();
  }

}
