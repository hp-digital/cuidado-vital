import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { ServicioServiceService } from '@services/servicio.service.service';
import { SettingsService } from '@services/settings.service';
import { CabeceraPacienteDTO } from '@models/cabecera-paciente';
import { MedicoAtencionDTO } from '@models/medico-atiente';
import { HistoriaPrimeraAtencionDTO } from '@models/primera-atencion';
import { DiagnosticoPrimeraAtencionDTO } from '@models/diagnostico-primera-atencion';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { MedicoAtiendeDTO } from '@models/medico-atiende';
import { PacienteExternoDTO } from '@models/paciente-externo';
import { AnamnesisDTO } from '@models/anamnesis';
import { AntecedentesAnamnesisDTO } from '@models/antecedente-anamnesis';
import { FuncionBiologicaDTO } from '@models/funcion-biologica';
import { ExamenFisicoDTO } from '@models/examen-fisico';
import { SignoVitalDTO } from '@models/signo-vital';
import { ExamenRegionalDTO } from '@models/examen-regional';
import { DiagnosticoCuidadoDTO } from '@models/diagnostico-cuidado';
import { ControlGeneralDTO } from '@models/control-general';
import { DesplegableDTO } from '@models/depleglable';
import { RecetaDTO } from '@models/RecetaDTO';
import { OrdenDTO } from '@models/OrdenDTO';
import { ControlPresionDTO } from '@models/control-presion';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
import { ControlGlucosaDTO } from '@models/control-glucosa';
import { ControlEpocDTO } from '@models/control-epoc';
import { HojaMonitoreoSignosDTO } from '@models/hoja-monitoreo';
import { SignoVitalHojaDTO } from '@models/signo-vital-hoja';
import { NotaEnfermeraDTO } from '@models/nota-enfermera';
import { SignoVitalNotaDTO } from '@models/signo-vital-notal';
import { SoapieDTO } from '@models/soapie';
import { EvaluacionDTO } from '@models/evaluacion-nota';
import { BalanceHidricoDTO } from '@models/balance-hidrico';
import { BalanceHidricoTurnoDTO } from '@models/balance-hidrico-turno';
import { BalanceHidricoIngresoDTO } from '@models/balance-hidrico-ingresos';
import { BalanceHidricoDetalleDTO } from '@models/balance-hidrico-detalle';
import { BalanceHidricoEgresoDTO } from '@models/balance-hidrico-egreso';
import { HistorialObstetricoDTO } from '@models/historial-obstetrico';
import { AntecedenteObstetricoDTO } from '@models/antecedente-obstetrico';
import { RiesgoObstetricoDTO } from '@models/riesgo-obstetrico';
import { RiesgoActualDTO } from '@models/riesgo-actual';
import { FuncionVitalObstetriciaDTO } from '@models/funcion-vital-obstetricia';
import { ExamenPreferencialDTO } from '@models/examen-preferencial';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-historial-obste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,ToastModule],
  providers: [MessageService],
  templateUrl: './historial-obste.component.html',
  styleUrl: './historial-obste.component.css'
})
export class HistorialObsteComponent implements OnInit{
  dataFormGroup: FormGroup;
  verSpinner:boolean = false;
  idRol: number=0;
  idMedico: number=0;

  paciente:string ='';
  medico:string='';
  nroHcl:string='';
  fechaActual:string='';

  idHistoria:number=0;

  verError: boolean = false;
  tituloError: string = "";
  mensajeError: string = "";

  objHistoria=new HistoriaCuidadoDTO();
  objObstetricia: HistorialObstetricoDTO[]=[];


  temperaturaRango: boolean = false;
  SaturacionOxigenoRango: boolean = false;
  FrecuenciaRespiratoriaRango: boolean = false;
  FrecuenciaCardicaRango: boolean = false;
  PrecionArterialRango: boolean = false;
  PrecionArterialRangoDis: boolean = false;
  PrecionArterialRangoIz: boolean = false;
  PrecionArterialRangoDisIz: boolean = false;

  colorEstadoTemp: string = '';
  colorEstadofrecar: string = '';
  colorEstadosat: string = '';
  colorEstadores: string = '';
  colorEstadoprecio: string = '';
  colorEstadopreArtDis: string = '';
  colorEstadopreArtDisIz: string = '';
  colorEstadoprecioIz: string = '';

  contadorControles: number = 0;
  fecha_atencion: Date = new Date();
  IMC: number = 0;
  verMotivoAro: boolean=false;

  listadoGeneral: string[]=[];
  listadoEspecificos: string[]=[];

  constructor(
    private bsModalHistorialClinico: BsModalRef,
    private modalService: BsModalService,
    private historiaService: HistoriaService,
    private servicioService: ServicioServiceService,
    private settings : SettingsService,
    private messageService: MessageService
  ){
    this.dataFormGroup = new FormGroup({
      inputG: new FormControl('', [Validators.required]),
      inputP: new FormControl('', [Validators.required]),
      inputG1: new FormControl('', [Validators.required]),
      inputG2: new FormControl('', [Validators.required]),
      inputG3: new FormControl('', [Validators.required]),
      inputFur: new FormControl('', [Validators.required]),
      inputFgFur: new FormControl('', [Validators.required]),
      inputEgEco: new FormControl('', [Validators.required]),
      inputFppFur: new FormControl('', [Validators.required]),
      inputFppEco: new FormControl('', [Validators.required]),
      inputCondicionMedicaCronica: new FormControl('', [Validators.required]),
      inputQuirurgicos: new FormControl('', [Validators.required]),
      inputEnfermedadesCongenitas: new FormControl('', [Validators.required]),
      inputFumaAlcohol: new FormControl('', [Validators.required]),
      inputPlacentaPrevia: new FormControl('', [Validators.required]),
      inputSobrepeso: new FormControl('', [Validators.required]),
      inputItu: new FormControl('', [Validators.required]),
      inputPresionAlta: new FormControl('', [Validators.required]),
      inputTemperatura: new FormControl('', [Validators.required]),
      inputFrecuenciaCardiaca: new FormControl('', [Validators.required]),
      inputPresionSistolica: new FormControl('', [Validators.required]),
      inputPresionDiastolica: new FormControl('', [Validators.required]),
      inputSaturacion: new FormControl('', [Validators.required]),
      inputFrecuenciaRespiratoria: new FormControl('', [Validators.required]),
      inputTalla: new FormControl('', [Validators.required]),
      inputPeso: new FormControl('', [Validators.required]),
      inputImc: new FormControl('', [Validators.required]),
      inputPesoHabitual: new FormControl('', [Validators.required]),
      inputPesoActual: new FormControl('', [Validators.required]),
      inputAumentoPeso: new FormControl('', [Validators.required]),
      inputAlturaUterina: new FormControl('', [Validators.required]),
      inputLcf: new FormControl('', [Validators.required]),
      inputMovFetal: new FormControl('', [Validators.required]),
      inputPlacenta: new FormControl('', [Validators.required]),
      inputIla: new FormControl('', [Validators.required]),
      inputLongCervix: new FormControl('', [Validators.required]),
      inputPosicion: new FormControl('', [Validators.required]),
      inputPesoFetal: new FormControl('', [Validators.required]),
      inputAro: new FormControl(''),
      inputDatoNino: new FormControl(''),
      inputSignoAlarma: new FormControl('', [Validators.required]),
      inputRecomendacionGeneral: new FormControl(),
      inputRecomendacionEspecifica: new FormControl(),
      inputMotivoAro: new FormControl(),
      inputDiagnostico: new FormControl(),
      inputPresionSistolicaIzquierda: new FormControl(),
      inputPresionDiastolicaIzquierda: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.idRol=this.settings.getUserSetting('idRol');
    this.fechaActual = moment().format('DD/MM/YYYY');
  }
  AsignarHistoriaClinica(idHistoriaClinica:number){
    console.log("nro his", idHistoriaClinica)
    this.idHistoria=idHistoriaClinica;
    this.ObtenerConfiguracion();
  }
  ObtenerConfiguracion() {
    this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(this.idHistoria),
      this.historiaService.ObtenerMedicamento(),
      this.servicioService.ObtenerListadoCatalogoOrden()
    ])
      .subscribe(
        data => {
          
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
    console.log("historia", objHistoria);
    this.paciente = objHistoria.cabeceraPaciente.apellidoPaterno+' '+objHistoria.cabeceraPaciente.apellidoMaterno+', '+objHistoria.cabeceraPaciente.nombre;
    this.nroHcl = objHistoria.cabeceraPaciente.numeroDocumento;
    this.medico = objHistoria.medicoAtiende?.apellidoPaterno+' '+objHistoria.medicoAtiende?.apellidoMaterno+', '+objHistoria.medicoAtiende?.nombre;

    let cabecera = new CabeceraPacienteDTO();
    if(objHistoria.cabeceraPaciente != null)
    {
      cabecera.Nombre = objHistoria.cabeceraPaciente.nombre;
      cabecera.ApellidoPaterno = objHistoria.cabeceraPaciente.apellidoPaterno;
      cabecera.ApellidoMaterno = objHistoria.cabeceraPaciente.apellidoMaterno;
      cabecera.FechaAtencion  = objHistoria.cabeceraPaciente.fechaAtencion;
      cabecera.NumeroHistoriaClinica = objHistoria.cabeceraPaciente.numeroHistoriaClinica;
      cabecera.Edad = objHistoria.cabeceraPaciente.edad;
      cabecera.Celular = objHistoria.cabeceraPaciente.celular;
      cabecera.EstadoCivil = objHistoria.cabeceraPaciente.estadoCivil;
      cabecera.Ocupacion = objHistoria.cabeceraPaciente.ocupacion;
      cabecera.NumeroDocumento = objHistoria.cabeceraPaciente.numeroDocumento;
      cabecera.Direccion = objHistoria.cabeceraPaciente.direccion;
    }

    let medic = new MedicoAtencionDTO();
    if(objHistoria.medicoAtiende != null)
    {
      medic.Nombre = objHistoria.medicoAtiende.nombre;
      medic.ApellidoPaterno = objHistoria.medicoAtiende.apellidoPaterno;
      medic.ApellidoMaterno = objHistoria.medicoAtiende.apellidoMaterno;
      medic.Celular = objHistoria.medicoAtiende.celular;
      medic.NumeroDocumento = objHistoria.medicoAtiende.numeroDocumento;
    }

    let primeraAtencion = new HistoriaPrimeraAtencionDTO();
    if(objHistoria.primeraAtencion != null)
    {
      primeraAtencion.Paciente = objHistoria.primeraAtencion.paciente;
      primeraAtencion.NroHcl = objHistoria.primeraAtencion.nroHcl;
      primeraAtencion.FechaPrimeraAtencion = objHistoria.primeraAtencion.fechaPrimeraAtencion;
      primeraAtencion.Anamnesis = objHistoria.primeraAtencion.anamnesis;
      primeraAtencion.FuncionBiologica = objHistoria.primeraAtencion.funcionBiologica;
      primeraAtencion.FuncionVital = objHistoria.primeraAtencion.funcionVital;
      primeraAtencion.ExamenFisico = objHistoria.primeraAtencion.examenFisico;

      primeraAtencion.Diagnostico=[];
      if(objHistoria.primeraAtencion.diagnostico != null)
      {
        objHistoria.primeraAtencion.diagnostico.forEach((element : any) => {
          let diag = new DiagnosticoPrimeraAtencionDTO();
          diag.CodigoCie10 = element.codigoCie10;
          diag.NombreDiagnostico = element.nombreDiagnostico;
          diag.TipoDiagnostico = element.tipoDiagnostico;

          primeraAtencion.Diagnostico.push(diag);
        });
      }
    }

    let externo = new HistoriaExternaDTO();
    if(objHistoria.historiaExterna!= null)
    {
      externo.CodigoIpress = objHistoria.historiaExterna.codigoIpress;
      externo.NumeroRuc = objHistoria.historiaExterna.numeroRuc;
      externo.RazonSocial = objHistoria.historiaExterna.razonSocial;
      externo.NumeroHistoriaClinica = objHistoria.historiaExterna.numeroHistoriaClinica;
      externo.FechaInicioAtencion = objHistoria.historiaExterna.fechaInicioAtencion;
      externo.FechaCierreAtencion = objHistoria.historiaExterna.fechaCierreAtencion;
      externo.Especialidad = objHistoria.historiaExterna.especialidad;
      externo.PlanTrabajo = objHistoria.historiaExterna.planTrabajo;
      externo.UrlPdfHistoriaClinica = objHistoria.historiaExterna.urlPdfHistoriaClinica;

      let medicoAtiende = new MedicoAtiendeDTO();
      medicoAtiende.TipoDocumento = objHistoria.historiaExterna.medico.tipoDocumento;
      medicoAtiende.NumeroDocumento = objHistoria.historiaExterna.medico.numeroDocumento;
      medicoAtiende.ApellidoPaterno = objHistoria.historiaExterna.medico.apellidoPaterno;
      medicoAtiende.ApellidoMaterno = objHistoria.historiaExterna.medico.apellidoMaterno;
      medicoAtiende.Nombres = objHistoria.historiaExterna.medico.nombres;
      medicoAtiende.FechaNacimiento = objHistoria.historiaExterna.medico.fechaNacimiento;
      medicoAtiende.Email = objHistoria.historiaExterna.medico.email;
      medicoAtiende.Direccion = objHistoria.historiaExterna.medico.direccion;
      medicoAtiende.Celular = objHistoria.historiaExterna.medico.celular;
      medicoAtiende.Sexo = objHistoria.historiaExterna.medico.sexo;
      medicoAtiende.NumeroColegiatura = objHistoria.historiaExterna.medico.numeroColegiatura;
      medicoAtiende.Rne = objHistoria.historiaExterna.medico.rne;
      externo.Medico = medicoAtiende;
  
      let pacienteExterno = new PacienteExternoDTO();
      pacienteExterno.TipoDocumento = objHistoria.historiaExterna.paciente.tipoDocumento;
      pacienteExterno.NumeroDocumento = objHistoria.historiaExterna.paciente.numeroDocumento;
      pacienteExterno.ApellidoPaterno = objHistoria.historiaExterna.paciente.apellidoPaterno;
      pacienteExterno.ApellidoMaterno = objHistoria.historiaExterna.paciente.apellidoMaterno;
      pacienteExterno.Nombres = objHistoria.historiaExterna.paciente.nombres;
      pacienteExterno.FechaNacimiento = objHistoria.historiaExterna.paciente.fechaNacimiento;
      pacienteExterno.Email = objHistoria.historiaExterna.paciente.email;
      pacienteExterno.Direccion = objHistoria.historiaExterna.paciente.direccion;
      pacienteExterno.Celular = objHistoria.historiaExterna.paciente.celular;
      pacienteExterno.Sexo = objHistoria.historiaExterna.paciente.sexo;
      pacienteExterno.EstadoCivil =  objHistoria.historiaExterna.paciente.estadoCivil;
      externo.Paciente = pacienteExterno;
  
      let anamnesis = new AnamnesisDTO();
      anamnesis.CursoEnfermedad = objHistoria.historiaExterna.anamnesis.cursoEnfermedad;
      anamnesis.MotivoConsulta = objHistoria.historiaExterna.anamnesis.motivoConsulta;
      anamnesis.SignosSintomas = objHistoria.historiaExterna.anamnesis.signosSintomas;
      anamnesis.TiempoEnfermedad = objHistoria.historiaExterna.anamnesis.tiempoEnfermedad;
  
      let antecedentes = new AntecedentesAnamnesisDTO();
      antecedentes.TratamientoUsoFrecuente = objHistoria.historiaExterna.anamnesis.antecedentes.tratamientoUsoFrecuente;
      antecedentes.Medicos=[];
      if(objHistoria.historiaExterna.anamnesis.antecedentes.medicos != null)
      {
        objHistoria.historiaExterna.anamnesis.antecedentes.medicos.forEach((element: any) => {
          let medico : string;
          medico = element;
          antecedentes.Medicos?.push(medico);
        });
      }
      antecedentes.Quirurgicos=[];
      if(objHistoria.historiaExterna.anamnesis.antecedentes.quirurgicos != null)
      {
        objHistoria.historiaExterna.anamnesis.antecedentes.quirurgicos.forEach((element: any) => {
          let quirurgico : string;
          quirurgico = element;
          antecedentes.Quirurgicos?.push(quirurgico);
        });
      }
      antecedentes.Familiares=[];
      if(objHistoria.historiaExterna.anamnesis.antecedentes.familiares != null)
      {
        objHistoria.historiaExterna.anamnesis.antecedentes.familiares.forEach((element: any) => {
          let familiar : string;
          familiar = element;
          antecedentes.Familiares?.push(familiar);
        });
      }
      antecedentes.Patologicos=[];
      if(objHistoria.historiaExterna.anamnesis.antecedentes.patologicos != null)
      {
        objHistoria.historiaExterna.anamnesis.antecedentes.patologicos.forEach((element: any) => {
          let patologico : string;
          patologico = element;
          antecedentes.Patologicos?.push(patologico);
        });
      }
      antecedentes.Alergias=[];
      if(objHistoria.historiaExterna.anamnesis.antecedentes.alergias != null)
      {
        objHistoria.historiaExterna.anamnesis.antecedentes.alergias.forEach((element: any) => {
          let alergia : string;
          alergia = element;
          antecedentes.Alergias?.push(alergia);
        });
      }
      antecedentes.ReaccionAdversa=[];
      if(objHistoria.historiaExterna.anamnesis.antecedentes.reaccionAdversa != null)
      {
        objHistoria.historiaExterna.anamnesis.antecedentes.reaccionAdversa.forEach((element: any) => {
          let reaccion : string;
          reaccion = element;
          antecedentes.ReaccionAdversa?.push(reaccion);
        });
      }
     
      anamnesis.Antecedentes = antecedentes;
      externo.Anamnesis = anamnesis;
  
      let funcionBiologica = new FuncionBiologicaDTO();
      funcionBiologica.Apetito = [];
      if(objHistoria.historiaExterna.funcionBiologica.apetito != null)
      {
        objHistoria.historiaExterna.funcionBiologica.apetito.forEach((element: any) => {
          let apetito : string;
          apetito = element;
          funcionBiologica.Apetito?.push(apetito);
        });
      }
      funcionBiologica.Orina = [];
      if(objHistoria.historiaExterna.funcionBiologica.orina != null)
      {
        objHistoria.historiaExterna.funcionBiologica.orina.forEach((element: any) => {
          let orina : string;
          orina = element;
          funcionBiologica.Orina?.push(orina);
        });
      }
      funcionBiologica.Sed = [];
      if(objHistoria.historiaExterna.funcionBiologica.sed != null)
      {
        objHistoria.historiaExterna.funcionBiologica.sed.forEach((element: any) => {
          let sed : string;
          sed = element;
          funcionBiologica.Sed?.push(sed);
        });
      }
      funcionBiologica.Deposiciones = [];
      if(objHistoria.historiaExterna.funcionBiologica.deposiciones != null)
      {
        objHistoria.historiaExterna.funcionBiologica.deposiciones.forEach((element: any) => {
          let deposicion : string;
          deposicion = element;
          funcionBiologica.Deposiciones?.push(deposicion);
        });
      }
      funcionBiologica.Suenno = [];
      if(objHistoria.historiaExterna.funcionBiologica.suenno != null)
      {
        objHistoria.historiaExterna.funcionBiologica.suenno.forEach((element: any) => {
          let suenno : string;
          suenno = element;
          funcionBiologica.Suenno?.push(suenno);
        });
      }
      funcionBiologica.EstadoPonderal = [];
      if(objHistoria.historiaExterna.funcionBiologica.estadoPonderal != null)
      {
        objHistoria.historiaExterna.funcionBiologica.estadoPonderal.forEach((element: any) => {
          let ponderal : string;
          ponderal = element;
          funcionBiologica.EstadoPonderal?.push(ponderal);
        });
      }
      funcionBiologica.Sudor = [];
      if(objHistoria.historiaExterna.funcionBiologica.sudor != null)
      {
        objHistoria.historiaExterna.funcionBiologica.sudor.forEach((element: any) => {
          let sudor : string;
          sudor = element;
          funcionBiologica.Sudor?.push(sudor);
        });
      }
      funcionBiologica.EstadoAnimo = [];
      if(objHistoria.historiaExterna.funcionBiologica.estadoAnimo != null)
      {
        objHistoria.historiaExterna.funcionBiologica.estadoAnimo.forEach((element: any) => {
          let animo : string;
          animo = element;
          funcionBiologica.EstadoAnimo?.push(animo);
        });
      }
      
      externo.FuncionBiologica = funcionBiologica;
  
      let examenFisico = new ExamenFisicoDTO();
      examenFisico.ExamenGeneral = objHistoria.historiaExterna.examenFisico.examenGeneral;
      let funcionVital = new SignoVitalDTO();
      funcionVital.Temperatura = objHistoria.historiaExterna.examenFisico.funcionVital.temperatura;
      funcionVital.FrecuenciaCardiaca = objHistoria.historiaExterna.examenFisico.funcionVital.frecuenciaCardiaca;
      funcionVital.PresionArterialSistolica = objHistoria.historiaExterna.examenFisico.funcionVital.presionArterialSistolica;
      funcionVital.PresionArterialDistolica = objHistoria.historiaExterna.examenFisico.funcionVital.presionArterialDistolica;
      funcionVital.SaturacionOxigeno = objHistoria.historiaExterna.examenFisico.funcionVital.saturacionOxigeno;
      funcionVital.FrecuenciaRespiratoria = objHistoria.historiaExterna.examenFisico.funcionVital.frecuenciaRespiratoria;
      funcionVital.Talla = objHistoria.historiaExterna.examenFisico.funcionVital.talla;
      funcionVital.Peso = objHistoria.historiaExterna.examenFisico.funcionVital.peso;
      funcionVital.IMC = objHistoria.historiaExterna.examenFisico.funcionVital.imc;
      funcionVital.PesoHabitual = objHistoria.historiaExterna.examenFisico.funcionVital.pesoHabitual;
      examenFisico.FuncionVital = funcionVital;
      
  
      let examenRegional = new ExamenRegionalDTO();
      examenRegional.PielAnexo=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.pielAnexo != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.pielAnexo.forEach((element: any) => {
          let piel : string;
          piel = element;
          examenRegional.PielAnexo?.push(piel);
        });
      }
      
      examenRegional.CabezaCuello=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.cabezaCuello != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.cabezaCuello.forEach((element: any) => {
          let piel : string;
          piel = element;
          examenRegional.CabezaCuello?.push(piel);
        });
      }
      examenRegional.Edema=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.edema != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.edema.forEach((element: any) => {
          let piel : string;
          piel = element;
          examenRegional.Edema?.push(piel);
        });
      }
      examenRegional.ToraxPulmon=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.toraxPulmon != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.toraxPulmon.forEach((element: any) => {
          let piel : string;
          piel = element;
          examenRegional.ToraxPulmon?.push(piel);
        });
      }
      examenRegional.Abdomen=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.abdomen != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.abdomen.forEach((element: any) => {
          let abdomen : string;
          abdomen = element;
          examenRegional.Abdomen?.push(abdomen);
        });
      }
      examenRegional.AparatoCardiovascular=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.aparatoCardiovascular != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.aparatoCardiovascular.forEach((element: any) => {
          let cardio : string;
          cardio = element;
          examenRegional.AparatoCardiovascular?.push(cardio);
        });
      }
      examenRegional.TactoRectal=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.tactoRectal != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.tactoRectal.forEach((element: any) => {
          let tacto : string;
          tacto = element;
          examenRegional.TactoRectal?.push(tacto);
        });
      }
      examenRegional.AparatoGenito=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.aparatoGenito != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.aparatoGenito.forEach((element: any) => {
          let genito : string;
          genito = element;
          examenRegional.AparatoGenito?.push(genito);
        });
      }
      examenRegional.SistemaNervioso=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.sistemaNervioso != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.sistemaNervioso.forEach((element: any) => {
          let nervioso : string;
          nervioso = element;
          examenRegional.SistemaNervioso?.push(nervioso);
        });
      }
      examenRegional.AparatoLocomotor=[];
      if(objHistoria.historiaExterna.examenFisico.examenRegional.aparatoLocomotor != null)
      {
        objHistoria.historiaExterna.examenFisico.examenRegional.aparatoLocomotor.forEach((element: any) => {
          let locomotor : string;
          locomotor = element;
          examenRegional.AparatoLocomotor?.push(locomotor);
        });
      }
      
      examenFisico.ExamenRegional = examenRegional;
      externo.ExamenFisico = examenFisico;
      
      let diagnosticoDTO :  DiagnosticoCuidadoDTO[]=[];
      if(objHistoria.historiaExterna.diagnostico != null)
      {
        objHistoria.historiaExterna.diagnostico.forEach((element:any)=>{
          let diagnostico = new DiagnosticoCuidadoDTO();
          diagnostico.CodigoCie10 = element.codigoCie10;
          diagnostico.NombreDiagnostico = element.nombreDiagnostico;
          diagnostico.TipoDiagnostico = element.tipoDiagnostico;
          diagnosticoDTO.push(diagnostico);
        });
      }
  
      externo.Diagnostico = diagnosticoDTO;
      externo.PlanTrabajo = objHistoria.historiaExterna.planTrabajo;
      externo.UrlPdfHistoriaClinica = objHistoria.historiaExterna.urlPdfHistoriaClinica;
    }

    let controlGeneral : ControlGeneralDTO[]=[];
    if(objHistoria.controlGeneral != null)
    {
      objHistoria.controlGeneral.forEach((element:any)=>{
        let control = new ControlGeneralDTO();
        control.Paciente = element.paciente;
        control.FechaRegistro = element.fechaRegistro;
        control.Alergias = element.alergias;
        control.Banno = new DesplegableDTO();
        control.Banno.Id = element.banno.id;
        control.Banno.Nombre = element.banno.nombre;
        control.Vestido= new DesplegableDTO();
        control.Vestido.Id = element.vestido.id;
        control.Vestido.Nombre = element.vestido.nombre;
        control.Wc= new DesplegableDTO();
        control.Wc.Id = element.wc.id;
        control.Wc.Nombre = element.wc.nombre;
        control.Movilidad= new DesplegableDTO();
        control.Movilidad.Id = element.movilidad.id;
        control.Movilidad.Nombre = element.movilidad.nombre;
        control.Continencia= new DesplegableDTO();
        control.Continencia.Id = element.continencia.id;
        control.Continencia.Nombre = element.continencia.nombre;
        control.Alimentacion= new DesplegableDTO();
        control.Alimentacion.Id = element.alimentacion.id;
        control.Alimentacion.Nombre = element.alimentacion.nombre;
        control.ResultadoEscalaKatz= new DesplegableDTO();
        control.ResultadoEscalaKatz.Id = element.resultadoEscalaKatz.id;
        control.ResultadoEscalaKatz.Nombre = element.resultadoEscalaKatz.nombre;
        control.DetalleResultadoKatz = element.detalleResultadoKatz;
        control.Temperatura = element.temperatura;
        control.Fc = element.fc;
        control.Fr = element.fr;
        control.PresionSistolica = element.presionSistolica;
        control.PresionDiastolica = element.presionDiastolica;
        control.Saturacion = element.saturacion;
        control.Peso = element.peso;
        control.Talla = element.talla;
        control.Imc = element.imc;
        control.FechaHoy = element.fechaHoy;
        control.DiaSemana = element.diaSemana;
        control.LugarEstamos = element.lugarEstamos;
        control.NumeroTelefono = element.numeroTelefono;
        control.DireccionCompleta = element.direccionCompleta;
        control.CuantosAnios = element.cuantosAnios;
        control.DondeNacio = element.dondeNacio;
        control.NombrePresidente = element.nombrePresidente;
        control.PrimerApellidoMadre = element.primerApellidoMadre;
        control.ValoracionMental = element.valoracionMental;
        control.ValoracionMentalDetalle = element.valoracionMentalDetalle;
        control.Caida = element.caida;
        control.CaidaDetalle = element.caidaDetalle;
        control.EstadoNutricional = new DesplegableDTO();
        control.EstadoNutricional.Id = element.estadoNutricional.id;
        control.EstadoNutricional.Nombre = element.estadoNutricional.nombre;
        control.EstadoNutricionalDetalle = element.estadoNutricionalDetalle;
        control.EstadoPsicosocial = new DesplegableDTO();
        control.EstadoPsicosocial.Id = element.estadoPsicosocial.id;
        control.EstadoPsicosocial.Nombre = element.estadoPsicosocial.nombre;
        control.EstadoPsicosocialDetalle = element.estadoPsicosocialDetalle;
        control.EstadoVision = new DesplegableDTO();
        control.EstadoVision.Id = element.estadoVision.id;
        control.EstadoVision.Nombre = element.estadoVision.nombre;
        control.EstadoVisionDetalle = element.estadoVisionDetalle;
        control.EstadoAudicion = new DesplegableDTO();
        control.EstadoAudicion.Id = element.estadoAudicion.id;
        control.EstadoAudicion.Nombre = element.estadoAudicion.nombre;
        control.EstadoAudicionDetalle = element.estadoAudicionDetalle;
        control.PlanTrabajo = element.planTrabajo;


        controlGeneral.push(control);
      });
    }
    
    let recetaListado : RecetaDTO[]=[];
    if(objHistoria.receta != null)
    {
      objHistoria.receta.forEach((element:any)=>{
        let receta = new RecetaDTO();
        receta.Indice = element.indice;
        receta.IdMedicamento = element.idMedicamento;
        receta.NombreMedicamento = element.nombreMedicamento;
        receta.Dosis = element.dosis;
        receta.Duracion = element.duracion;
        receta.DuracionDetalle = element.duracionDetalle;
        receta.Via = element.via;
        receta.Indicaciones = element.indicaciones;

        recetaListado.push(receta);
      })
    }

    let ordenListado : OrdenDTO[]=[];
    if(objHistoria.orden != null)
    {
      objHistoria.orden.forEach((element:any)=>{
        let orden = new OrdenDTO();
        orden.Indice = element.indice;
        orden.IdServicio = element.idServicio;
        orden.Servicio = element.servicio;
        orden.Tipo = element.tipo;
        orden.Indicaciones = element.indicaciones;
        
        ordenListado.push(orden);
      });
    }

    let controlPresion : ControlPresionDTO[]=[];
    if(objHistoria.controlPresion != null){
      let _med : MedidasAntropometricasDTO[]=[];
      objHistoria.controlPresion.forEach((element:any)=>{
        let presion = new ControlPresionDTO();
        presion.Fecha = element.fecha;
        presion.Paciente = element.paciente;
        presion.PlanTrabajo = element.planTrabajo;
        
        if(element.medidasAntroprometricas != null)
        {
          element.medidasAntroprometricas.forEach((sstf:any)=>{
            let medidas = new MedidasAntropometricasDTO();
            medidas.Fecha = sstf.fecha;
            medidas.Sistolica = sstf.sistolica;
            medidas.Diastolica = sstf.diastolica;
            medidas.Fr = sstf.fr;
            medidas.Pulso = sstf.pulso;
            medidas.Estado = sstf.estado;

            _med.push(medidas);
            //presion.MedidasAntroprometricas.push(medidas);
          });
          presion.MedidasAntroprometricas = _med;
        }

        controlPresion.push(presion);
      })
    }

    let controlGlucosa : ControlGlucosaDTO[] = [];
    if(objHistoria.controlGlucosa != null){
      objHistoria.controlGlucosa.forEach((element:any)=>{
        let gluco = new ControlGlucosaDTO();
        gluco.Paciente = element.paciente;
        gluco.TipoDiabetes = element.tipoDiabetes;
        gluco.FechaDiagnostico = element.fechaDiagnostico ;
        gluco.Complicacion = new DesplegableDTO();
        gluco.Complicacion.Id = element.complicacion.id;
        gluco.Complicacion.Nombre = element.complicacion.nombre;
        gluco.Retinopatia = new DesplegableDTO();
        gluco.Retinopatia.Id = element.retinopatia.id;
        gluco.Retinopatia.Nombre = element.retinopatia.nombre;
        gluco.Nefropatia = new DesplegableDTO();
        gluco.Nefropatia.Id = element.nefropatia.id;
        gluco.Nefropatia.Nombre = element.nefropatia.nombre;
        gluco.Amputacion = new DesplegableDTO();
        gluco.Amputacion.Id = element.amputacion.id;
        gluco.Amputacion.Nombre = element.amputacion.nombre;
        gluco.Dialisis = new DesplegableDTO();
        gluco.Dialisis.Id = element.dialisis.id;
        gluco.Dialisis.Nombre = element.dialisis.nombre;
        gluco.Ceguera = new DesplegableDTO();
        gluco.Ceguera.Id = element.ceguera.id;
        gluco.Ceguera.Nombre = element.ceguera.nombre;
        gluco.TransplanteRenal = new DesplegableDTO();
        gluco.TransplanteRenal.Id = element.transplanteRenal.id;
        gluco.TransplanteRenal.Nombre = element.transplanteRenal.nombre;
        gluco.Talla = element.talla;
        gluco.Peso = element.peso;
        gluco.IMC = element.imc;
        gluco.PerimetroAbdominal = element.perimetroAbdominal;
        gluco.PresionArterial = element.presionArterial;
        gluco.ValorGlucemia = element.valorGlucemia;
        gluco.FechaGlucemia = element.fechaGlucemia;
        gluco.ValorHba = element.valorHba;
        gluco.FechaHba = element.fechaHba;
        gluco.ValorCreatinina = element.valorCreatinina;
        gluco.FechaCreatinina = element.fechaCreatinina;
        gluco.ValorLdl = element.valorLdl;
        gluco.FechaLdl = element.fechaLdl;
        gluco.ValorTrigliceridos = element.valorTrigliceridos;
        gluco.FechaTrigliceridos = element.fechaTrigliceridos;
        gluco.ValorMicro = element.valorMicro;
        gluco.FechaMicro = element.fechaMicro;
        gluco.PlanTrabajo = element.planTrabajo;
        gluco.InsulinaMono = element.insulinaMono;
        gluco.InsulinaDosis = element.insulinaDosis;
        gluco.MedicamentoMono = element.medicamentoMono;
        gluco.MedicamentoDosis = element.medicamentoDosis;
        gluco.FechaRegistro = element.fechaRegistro;
        
        controlGlucosa.push(gluco);
      });
    }

    let controlEpoc : ControlEpocDTO[] = [];
    if(objHistoria.controlEpoc != null){
      objHistoria.controlEpoc.forEach((element:any) =>{

        let epoc = new ControlEpocDTO();
        epoc.Paciente= element.paciente;
        epoc.FechaRegistro= element.fechaRegistro;
        epoc.Banno= new DesplegableDTO();
        epoc.Banno.Id = element.banno.id;
        epoc.Banno.Nombre = element.banno.nombre;
        epoc.Vestido= new DesplegableDTO();
        epoc.Vestido.Id = element.vestido.id;
        epoc.Vestido.Nombre = element.vestido.nombre;
        epoc.Wc= new DesplegableDTO();
        epoc.Wc.Id = element.wc.id;
        epoc.Wc.Nombre = element.wc.nombre;
        epoc.Movilidad= new DesplegableDTO();
        epoc.Movilidad.Id = element.movilidad.id;
        epoc.Movilidad.Nombre = element.movilidad.nombre;
        epoc.Continencia= new DesplegableDTO();
        epoc.Continencia.Id = element.continencia.id;
        epoc.Continencia.Nombre = element.continencia.nombre;
        epoc.Alimentacion= new DesplegableDTO();
        epoc.Alimentacion.Id = element.alimentacion.id;
        epoc.Alimentacion.Nombre = element.alimentacion.nombre;
        epoc.ResultadoEscala= new DesplegableDTO();
        epoc.ResultadoEscala.Id = element.resultadoEscala.id;
        epoc.ResultadoEscala.Nombre = element.resultadoEscala.nombre;
        epoc.Dificultad= element.dificultad;
        epoc.FaseEpoc= new DesplegableDTO();
        epoc.FaseEpoc.Id = element.faseEpoc.id;
        epoc.FaseEpoc.Nombre = element.faseEpoc.nombre;
        epoc.FechaDiagnostico= element.fechaDiagnostico;
        epoc.Alcohol= new DesplegableDTO();
        epoc.Alcohol.Id = element.alcohol.id;
        epoc.Alcohol.Nombre = element.alcohol.nombre;
        epoc.Drogas= new DesplegableDTO();
        epoc.Drogas.Id = element.drogas.id;
        epoc.Drogas.Nombre = element.drogas.nombre;
        epoc.Tabaco= new DesplegableDTO();
        epoc.Tabaco.Id = element.tabaco.id;
        epoc.Tabaco.Nombre = element.tabaco.nombre;
        epoc.SistemaRespiratorio= new DesplegableDTO();
        epoc.SistemaRespiratorio.Id = element.sistemaRespiratorio.id;
        epoc.SistemaRespiratorio.Nombre = element.sistemaRespiratorio.nombre;
        epoc.SistemaRespiratorioDetalle= element.sistemaRespiratorioDetalle;
        epoc.EvaluacionFuncional= element.evaluacionFuncional;
        epoc.PlanTrabajo= element.planTrabajo;

        controlEpoc.push(epoc);
      });
    
    }

    let hojaMonitoreo = new HojaMonitoreoSignosDTO();
    if(objHistoria.hojaMonitoreoSignos != null){
      hojaMonitoreo.Paciente = objHistoria.hojaMonitoreoSignos.paciente;
      hojaMonitoreo.Medico = objHistoria.hojaMonitoreoSignos.medico;
      hojaMonitoreo.SignoVital=[]
      if(objHistoria.hojaMonitoreoSignos.signoVital!=null)
      {
        objHistoria.hojaMonitoreoSignos.signoVital.forEach((element:any)=>{
          let signo = new SignoVitalHojaDTO();
          signo.FechaRegistro=element.fechaRegistro;
          signo.PresionSistolica=element.presionSistolica;
          signo.PresionDiastolica=element.presionDiastolica;
          signo.Pulso=element.pulso;
          signo.Temperatura=element.temperatura;
          signo.FrecuenciaRespiratoria=element.frecuenciaRespiratoria;
          signo.Saturacion=element.saturacion;
          signo.Oxigeno=element.oxigeno;
          signo.Peso=element.peso;
          signo.Deposiciones=element.deposiciones;
          signo.Orina=element.orina;
          signo.Ingresos=element.ingresos;
          signo.Egresos=element.egresos;
          signo.TotalBH=element.totalBH;
  
          hojaMonitoreo.SignoVital?.push(signo);
        });
      }
    }

    let notaEnfermera = new NotaEnfermeraDTO();
    if(objHistoria.notaEnfermera != null)
    {
      
      notaEnfermera.Paciente = objHistoria.notaEnfermera.paciente;
      notaEnfermera.Medico = objHistoria.notaEnfermera.medico;
      notaEnfermera.NroHcl = objHistoria.notaEnfermera.nroHcl;
      notaEnfermera.FechaNota = objHistoria.notaEnfermera.fechaNota;
      
      let sign = new SignoVitalNotaDTO();
      if(objHistoria.notaEnfermera.signoVital!= null)
      {
        sign.Temperatura = objHistoria.notaEnfermera.signoVital.temperatura;
        sign.FrecuenciaCardiaca = objHistoria.notaEnfermera.signoVital.frecuenciaCardiaca;
        sign.PresionSistolica = objHistoria.notaEnfermera.signoVital.presionSistolica;
        sign.PresionDiastolica = objHistoria.notaEnfermera.signoVital.presionDiastolica;
        sign.SaturacionOxigeno = objHistoria.notaEnfermera.signoVital.saturacionOxigeno;
        sign.FrecuenciaRespiratoria = objHistoria.notaEnfermera.signoVital.frecuenciaRespiratoria;
        notaEnfermera.SignoVital = sign;
      }
      
      
      let soapie = new SoapieDTO();
      if(objHistoria.notaEnfermera.soapie != null)
      {
        soapie.Subjetivos = objHistoria.notaEnfermera.soapie.subjetivos;
        soapie.Objetivos = objHistoria.notaEnfermera.soapie.objetivos;
        
        soapie.Medicacion= [] ;
        soapie.Procedimiento= [] ;
        soapie.Diagnostico= [] ;
        soapie.Planteamiento= [] ;
        soapie.Ocurrencias= [] ;
        soapie.Pendientes= [] ;
        soapie.Evaluacion= [] ;
        soapie.Diuresis= [] ;
        soapie.Deposicion= [] ;
        
        if(objHistoria.notaEnfermera.soapie.medicacion != null)
        {
          objHistoria.notaEnfermera.soapie.medicacion.forEach((element:any)=>{
            let medicacion = new EvaluacionDTO();
            medicacion.Item = element.item;
            medicacion.Nota = element.nota;
            medicacion.FechaNota = element.fechaNota;
            medicacion.Usuario = element.usuario;
        
            soapie.Medicacion?.push(medicacion);
          });
        }
        if(objHistoria.notaEnfermera.soapie.procedimiento != null)
        {
          objHistoria.notaEnfermera.soapie.procedimiento.forEach((element:any)=>{
            let procedimiento = new EvaluacionDTO();
            procedimiento.Item = element.item;
            procedimiento.Nota = element.nota;
            procedimiento.FechaNota = element.fechaNota;
            procedimiento.Usuario = element.usuario;
        
            soapie.Procedimiento?.push(procedimiento);
          });
        }
        if(objHistoria.notaEnfermera.soapie.diagnostico != null)
        {
          objHistoria.notaEnfermera.soapie.diagnostico.forEach((element:any)=>{
            let diagnostico = new EvaluacionDTO();
            diagnostico.Item = element.item;
            diagnostico.Nota = element.nota;
            diagnostico.FechaNota = element.fechaNota;
            diagnostico.Usuario = element.usuario;
        
            soapie.Diagnostico?.push(diagnostico);
          });
        }
        if(objHistoria.notaEnfermera.soapie.planteamiento != null)
        {
          objHistoria.notaEnfermera.soapie.planteamiento.forEach((element:any)=>{
            let planteamiento = new EvaluacionDTO();
            planteamiento.Item = element.item;
            planteamiento.Nota = element.nota;
            planteamiento.FechaNota = element.fechaNota;
            planteamiento.Usuario = element.usuario;
        
            soapie.Planteamiento?.push(planteamiento);
          });
        }
        if(objHistoria.notaEnfermera.soapie.ocurrencias != null)
        {
          objHistoria.notaEnfermera.soapie.ocurrencias.forEach((element:any)=>{
            let ocurrencias = new EvaluacionDTO();
            ocurrencias.Item = element.item;
            ocurrencias.Nota = element.nota;
            ocurrencias.FechaNota = element.fechaNota;
            ocurrencias.Usuario = element.usuario;
        
            soapie.Ocurrencias?.push(ocurrencias);
          });
        }
        
        
        if(objHistoria.notaEnfermera.soapie.pendientes != null)
        {
          objHistoria.notaEnfermera.soapie.pendientes.forEach((element:any)=>{
            let pendientes = new EvaluacionDTO();
            pendientes.Item = element.item;
            pendientes.Nota = element.nota;
            pendientes.FechaNota = element.fechaNota;
            pendientes.Usuario = element.usuario;
        
            soapie.Pendientes?.push(pendientes);
          });
        }
        if(objHistoria.notaEnfermera.soapie.evaluacion != null)
        {
          objHistoria.notaEnfermera.soapie.evaluacion.forEach((element:any)=>{
            let evaluacion = new EvaluacionDTO();
            evaluacion.Item = element.item;
            evaluacion.Nota = element.nota;
            evaluacion.FechaNota = element.fechaNota;
            evaluacion.Usuario = element.usuario;
        
            soapie.Evaluacion?.push(evaluacion);
          });
        }
        if(objHistoria.notaEnfermera.soapie.diuresis != null)
        {
          objHistoria.notaEnfermera.soapie.diuresis.forEach((element:any)=>{
            let diuresis = new EvaluacionDTO();
            diuresis.Item = element.item;
            diuresis.Nota = element.nota;
            diuresis.FechaNota = element.fechaNota;
            diuresis.Usuario = element.usuario;
        
            soapie.Diuresis?.push(diuresis);
          });
        }
        if(objHistoria.notaEnfermera.soapie.deposicion != null)
        {
          objHistoria.notaEnfermera.soapie.deposicion.forEach((element:any)=>{
            let deposicion = new EvaluacionDTO();
            deposicion.Item = element.item;
            deposicion.Nota = element.nota;
            deposicion.FechaNota = element.fechaNota;
            deposicion.Usuario = element.usuario;
        
            soapie.Deposicion?.push(deposicion);
          });
        }
      }
      notaEnfermera.Soapie = soapie;
    }

    let balance = new BalanceHidricoDTO();
    if(objHistoria.balanceHidrico != null)
    {
      balance.Paciente = objHistoria.balanceHidrico.paciente;
      balance.Medico = objHistoria.balanceHidrico.medico;
      balance.NroHcl = objHistoria.balanceHidrico.nroHcl;
      balance.Peso = objHistoria.balanceHidrico.peso;
      balance.Talla = objHistoria.balanceHidrico.talla;
      balance.IMC = objHistoria.balanceHidrico.imc;
      balance.Tiempo = objHistoria.balanceHidrico.tiempo;
      balance.Fecha = objHistoria.balanceHidrico.fecha;
      balance.FechaTexto = objHistoria.balanceHidrico.fechaTexto;

      if(objHistoria.balanceHidrico.balanceHidrico != null)
      {
        balance.BalanceHidrico = [];
        objHistoria.balanceHidrico.balanceHidrico.forEach((element:any)=>{

          let item: any = objHistoria.balanceHidrico.balanceHidrico.length;
          let hidrico = new BalanceHidricoTurnoDTO();
          hidrico.Item = ++item;
          hidrico.Fecha = element.fecha;
          hidrico.FechaTexto = element.fechaTexto; 
          hidrico.DatosCompletos = element.datosCompletos;  
          hidrico.BalanceHidrico = element.balanceHidrico;

          hidrico.Ingreso = new BalanceHidricoIngresoDTO();
          hidrico.Ingreso.Oral = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.Oral.PrimerTurno = element.ingreso.oral.primerTurno;
          hidrico.Ingreso.Oral.SegundoTurno = element.ingreso.oral.segundoTurno;
          hidrico.Ingreso.Oral.Total = element.ingreso.oral.total;
          hidrico.Ingreso.ParentalTratamiento = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.ParentalTratamiento.PrimerTurno = element.ingreso.parentalTratamiento.primerTurno;
          hidrico.Ingreso.ParentalTratamiento.SegundoTurno = element.ingreso.parentalTratamiento.segundoTurno;
          hidrico.Ingreso.ParentalTratamiento.Total = element.ingreso.parentalTratamiento.total;
          hidrico.Ingreso.Sangre = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.Sangre.PrimerTurno = element.ingreso.sangre.primerTurno;
          hidrico.Ingreso.Sangre.SegundoTurno = element.ingreso.sangre.segundoTurno;
          hidrico.Ingreso.Sangre.Total = element.ingreso.sangre.total;
          hidrico.Ingreso.AguaOxidacion = new BalanceHidricoDetalleDTO();
          hidrico.Ingreso.AguaOxidacion.PrimerTurno = element.ingreso.aguaOxidacion.primerTurno;
          hidrico.Ingreso.AguaOxidacion.SegundoTurno = element.ingreso.aguaOxidacion.segundoTurno;
          hidrico.Ingreso.AguaOxidacion.Total = element.ingreso.aguaOxidacion.total;
          hidrico.Ingreso.Otros = [];
          if (element.ingreso.otros != null) {
            element.ingreso.otros.forEach((dato: any) => {
              let item: any = hidrico.Ingreso?.Otros?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.texto;
              otro.PrimerTurno = dato.primerTurno;
              otro.SegundoTurno = dato.segundoTurno;
              otro.Total = dato.total;
              hidrico.Ingreso?.Otros?.push(otro);
            });
          }
          hidrico.Ingreso.SumatoriaTotal = element.ingreso.sumatoriaTotal;
          hidrico.Ingreso.Fecha = element.ingreso.fecha;
          hidrico.Ingreso.FechaTexto = element.ingreso.fechaTexto;
          

          hidrico.Egreso = new BalanceHidricoEgresoDTO();
          hidrico.Egreso.Orina = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Orina.PrimerTurno = element.egreso.orina.primerTurno;
          hidrico.Egreso.Orina.SegundoTurno = element.egreso.orina.segundoTurno;
          hidrico.Egreso.Orina.Total = element.egreso.orina.total;
          hidrico.Egreso.Vomito = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Vomito.PrimerTurno = element.egreso.vomito.primerTurno;
          hidrico.Egreso.Vomito.SegundoTurno = element.egreso.vomito.segundoTurno;
          hidrico.Egreso.Vomito.Total = element.egreso.vomito.total;
          hidrico.Egreso.Aspiracion = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Aspiracion.PrimerTurno = element.egreso.aspiracion.primerTurno;
          hidrico.Egreso.Aspiracion.SegundoTurno = element.egreso.aspiracion.segundoTurno;
          hidrico.Egreso.Aspiracion.Total = element.egreso.aspiracion.total;
          hidrico.Egreso.Drenaje = [];
          if (element.egreso.drenaje != null) {
            element.egreso.drenaje.forEach((dato: any) => {
              let item: any = hidrico.Egreso?.Drenaje?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.texto;
              otro.PrimerTurno = dato.primerTurno;
              otro.SegundoTurno = dato.segundoTurno;
              otro.Total = dato.total;
              hidrico.Egreso?.Drenaje?.push(otro);
            });
          }
          hidrico.Egreso.PerdidaIncesante = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.PerdidaIncesante.PrimerTurno = element.egreso.perdidaIncesante.primerTurno;
          hidrico.Egreso.PerdidaIncesante.SegundoTurno = element.egreso.perdidaIncesante.segundoTurno;
          hidrico.Egreso.PerdidaIncesante.Total = element.egreso.perdidaIncesante.total;
          hidrico.Egreso.Deposiciones = new BalanceHidricoDetalleDTO();
          hidrico.Egreso.Deposiciones.PrimerTurno = element.egreso.deposiciones.primerTurno;
          hidrico.Egreso.Deposiciones.SegundoTurno = element.egreso.deposiciones.segundoTurno;
          hidrico.Egreso.Deposiciones.Total = element.egreso.deposiciones.total;
          hidrico.Egreso.Otros = [];
          if (element.egreso.otros != null) {
            element.egreso.otros.forEach((dato: any) => {
              let item: any = hidrico.Egreso?.Otros?.length;
              let otro = new BalanceHidricoDetalleDTO();
              otro.Item = ++item;
              otro.Texto = dato.texto;
              otro.PrimerTurno = dato.primerTurno;
              otro.SegundoTurno = dato.segundoTurno;
              otro.Total = dato.total;
              hidrico.Egreso?.Otros?.push(otro);
            });
          }
          hidrico.Egreso.SumatoriaTotal = element.egreso.sumatoriaTotal;
          hidrico.Egreso.Fecha = element.egreso.fecha;
          hidrico.Egreso.FechaTexto = element.egreso.fechaTexto;

          balance.BalanceHidrico?.push(hidrico);
        });
        
      }
      
    }

    let obstetricia : HistorialObstetricoDTO[] = [];
    if(objHistoria.historialObstetrico != null)
    {
      objHistoria.historialObstetrico.forEach((element:any)=>{
        let obs = new HistorialObstetricoDTO();
        obs.Paciente = element.paciente;
        obs.NroHcl = element.nroHcl;
        obs.Personal = element.personal;
        obs.IdPersonal = element.idPersonal;
        obs.FechaRegistro = element.fechaRegistro;

        obs.Antecedentes = new AntecedenteObstetricoDTO();
        obs.Antecedentes.G = element.antecedentes.g;
        obs.Antecedentes.P = element.antecedentes.p;
        obs.Antecedentes.G1 = element.antecedentes.g1;
        obs.Antecedentes.G2 = element.antecedentes.g2;
        obs.Antecedentes.G3 = element.antecedentes.g3;
        obs.Antecedentes.Fur = element.antecedentes.fur;
        obs.Antecedentes.FgFur = element.antecedentes.fgFur;
        obs.Antecedentes.EgEco = element.antecedentes.egEco;
        obs.Antecedentes.FppFur = element.antecedentes.fppFur;
        obs.Antecedentes.FppEco = element.antecedentes.fppEco;

        obs.RiesgosPreExistente = new RiesgoObstetricoDTO();
        obs.RiesgosPreExistente.CondicionMedica = element.riesgosPreExistente.condicionMedica;
        obs.RiesgosPreExistente.Quirurgico = element.riesgosPreExistente.quirurgico;
        obs.RiesgosPreExistente.EnfermedadCongenita = element.riesgosPreExistente.enfermedadCongenita;
        obs.RiesgosPreExistente.Fuma = element.riesgosPreExistente.fuma;

        obs.RiesgoActual = new RiesgoActualDTO();
        obs.RiesgoActual.PlacentaPrevia = element.riesgoActual.placentaPrevia;
        obs.RiesgoActual.SobrePeso = element.riesgoActual.sobrePeso;
        obs.RiesgoActual.Itu = element.riesgoActual.itu;
        obs.RiesgoActual.PresionAlta = element.riesgoActual.presionAlta;

        obs.FuncionVital = new FuncionVitalObstetriciaDTO();
        obs.FuncionVital.Temperatura = element.funcionVital.temperatura;
        obs.FuncionVital.Fc = element.funcionVital.fc;
        obs.FuncionVital.PresionSistolica = element.funcionVital.presionSistolica;
        obs.FuncionVital.PresionDiastolica = element.funcionVital.presionDiastolica;
        obs.FuncionVital.PresionSistolicaIzquierda = element.funcionVital.presionSistolicaIzquierda;
        obs.FuncionVital.PresionDiastolicaIzquierda = element.funcionVital.presionDiastolicaIzquierda;
        obs.FuncionVital.Saturacion = element.funcionVital.saturacion;
        obs.FuncionVital.Fr = element.funcionVital.fr;
        obs.FuncionVital.Talla = element.funcionVital.talla;
        obs.FuncionVital.Peso = element.funcionVital.peso;
        obs.FuncionVital.Imc = element.funcionVital.imc;
        obs.FuncionVital.PesoHabitual = element.funcionVital.pesoHabitual;
        obs.FuncionVital.PesoActual = element.funcionVital.pesoActual;
        obs.FuncionVital.AumentoPeso = element.funcionVital.aumentoPeso;

        obs.ExamenPreferencial = new ExamenPreferencialDTO();
        obs.ExamenPreferencial.AlturaUterina = element.examenPreferencial.alturaUterina;
        obs.ExamenPreferencial.Lcf = element.examenPreferencial.lcf;
        obs.ExamenPreferencial.MovFetal = element.examenPreferencial.movFetal;
        obs.ExamenPreferencial.Placente = element.examenPreferencial.placente;
        obs.ExamenPreferencial.Ila = element.examenPreferencial.ila;
        obs.ExamenPreferencial.LogCervix = element.examenPreferencial.logCervix;
        obs.ExamenPreferencial.Posicion = element.examenPreferencial.posicion;
        obs.ExamenPreferencial.PesoFetal = element.examenPreferencial.pesoFetal;

        obs.Aro = element.aro;
        obs.AroMotivo = element.aroMotivo;
        obs.DatoNino = element.datoNino;
        obs.SignosAlarma = element.signoAlarma;
        obs.Diagnostico = element.diagnostico;

        obs.RecomendacionesGenerales = [];
        if(element.recomendacionesGenerales != null)
        {
          element.recomendacionesGenerales.forEach((element:any)=>{
            let gen :string='';
            gen=element
            obs.RecomendacionesGenerales?.push(gen)
          });
        }
        obs.RecomendacionesEspecificas = [];
        if(element.recomendacionesEspecificas != null)
        {
          element.recomendacionesEspecificas.forEach((element:any)=>{
            let espe :string='';
            espe=element
            obs.RecomendacionesEspecificas?.push(espe)
          });
        }
        obstetricia.push(obs);
      });
      this.objObstetricia = obstetricia;
      this.MostrarDatos(obstetricia);
    }


    let historiaCalidad = new HistoriaCuidadoDTO();
    historiaCalidad.cabeceraPaciente = cabecera;
    historiaCalidad.MedicoAtiende = medic;
    historiaCalidad.IdPaciente = objHistoria.idPaciente;
    historiaCalidad.IdHistoriaClinica = objHistoria.idHistoriaClinica;
    historiaCalidad.IdPersonal = objHistoria.idPersonal;
    historiaCalidad.IdMedico = objHistoria.idMedico;
    historiaCalidad.IdEspecialidad = objHistoria.idEspecialidad;
    historiaCalidad.FechaInicioAtencion = objHistoria.fechaInicioAtencion;
    historiaCalidad.FechaFinAtencion = objHistoria.fechaFinAtencion;
    historiaCalidad.Estado = objHistoria.estado;
    historiaCalidad.UsuarioCreacion = objHistoria.usuarioCreacion;
    historiaCalidad.UsuarioModificacion = objHistoria.usuarioModificacion;
    historiaCalidad.FechaCreacion = objHistoria.fechaCreacion;
    historiaCalidad.FechaModificacion = objHistoria.fechaModificacion;
    historiaCalidad.ControlGeneral = controlGeneral
    historiaCalidad.Orden = ordenListado;
    historiaCalidad.Receta = recetaListado;
    historiaCalidad.ControlPresion = controlPresion;
    historiaCalidad.ControlGlucosa = controlGlucosa;
    historiaCalidad.ControlEpoc = controlEpoc;
    historiaCalidad.HistoriaExterna = objHistoria.historiaExterna;
    historiaCalidad.PrimeraAtencion = objHistoria.primeraAtencion;
    historiaCalidad.HistorialObstetrico = obstetricia;

    this.objHistoria = historiaCalidad;
  }

  MostrarDatos(obstetricia:HistorialObstetricoDTO[]){
    console.log("objObste", obstetricia)

    this.dataFormGroup.controls['inputG'].setValue(obstetricia[0].Antecedentes?.G);
    this.dataFormGroup.controls['inputP'].setValue(obstetricia[0].Antecedentes?.P);
    this.dataFormGroup.controls['inputG1'].setValue(obstetricia[0].Antecedentes?.G1);
    this.dataFormGroup.controls['inputG2'].setValue(obstetricia[0].Antecedentes?.G2);
    this.dataFormGroup.controls['inputG3'].setValue(obstetricia[0].Antecedentes?.G3);
    this.dataFormGroup.controls['inputFur'].setValue(moment(obstetricia[0].Antecedentes?.Fur).format('yyyy-MM-DD'));
    this.dataFormGroup.controls['inputFgFur'].setValue(obstetricia[0].Antecedentes?.FgFur);
    this.dataFormGroup.controls['inputEgEco'].setValue(obstetricia[0].Antecedentes?.EgEco);
    this.dataFormGroup.controls['inputFppFur'].setValue(moment(obstetricia[0].Antecedentes?.FppFur).format('yyyy-MM-DD'));
    this.dataFormGroup.controls['inputFppEco'].setValue(moment(obstetricia[0].Antecedentes?.FppEco).format('yyyy-MM-DD'));

    this.dataFormGroup.controls['inputCondicionMedicaCronica'].setValue(obstetricia[0].RiesgosPreExistente?.CondicionMedica);
    this.dataFormGroup.controls['inputQuirurgicos'].setValue(obstetricia[0].RiesgosPreExistente?.Quirurgico);
    this.dataFormGroup.controls['inputEnfermedadesCongenitas'].setValue(obstetricia[0].RiesgosPreExistente?.EnfermedadCongenita);
    this.dataFormGroup.controls['inputFumaAlcohol'].setValue(obstetricia[0].RiesgosPreExistente?.Fuma);

    this.dataFormGroup.controls['inputPlacentaPrevia'].setValue(obstetricia[0].RiesgoActual?.PlacentaPrevia);
    this.dataFormGroup.controls['inputSobrepeso'].setValue(obstetricia[0].RiesgoActual?.SobrePeso);
    this.dataFormGroup.controls['inputItu'].setValue(obstetricia[0].RiesgoActual?.Itu);
    this.dataFormGroup.controls['inputPresionAlta'].setValue(obstetricia[0].RiesgoActual?.PresionAlta);

    this.dataFormGroup.controls['inputTemperatura'].setValue(obstetricia[0].FuncionVital?.Temperatura);
    this.dataFormGroup.controls['inputFrecuenciaCardiaca'].setValue(obstetricia[0].FuncionVital?.Fc);
    this.dataFormGroup.controls['inputPresionSistolica'].setValue(obstetricia[0].FuncionVital?.PresionSistolica);
    this.dataFormGroup.controls['inputPresionDiastolica'].setValue(obstetricia[0].FuncionVital?.PresionDiastolica);
    this.dataFormGroup.controls['inputPresionSistolicaIzquierda'].setValue(obstetricia[0].FuncionVital?.PresionSistolicaIzquierda);
    this.dataFormGroup.controls['inputPresionDiastolicaIzquierda'].setValue(obstetricia[0].FuncionVital?.PresionDiastolicaIzquierda);
    this.dataFormGroup.controls['inputSaturacion'].setValue(obstetricia[0].FuncionVital?.Saturacion);
    this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].setValue(obstetricia[0].FuncionVital?.Fr);
    this.dataFormGroup.controls['inputTalla'].setValue(obstetricia[0].FuncionVital?.Talla);
    this.dataFormGroup.controls['inputPeso'].setValue(obstetricia[0].FuncionVital?.Peso);
    this.dataFormGroup.controls['inputImc'].setValue(obstetricia[0].FuncionVital?.Imc);
    this.dataFormGroup.controls['inputPesoHabitual'].setValue(obstetricia[0].FuncionVital?.PesoHabitual);
    this.dataFormGroup.controls['inputPesoActual'].setValue(obstetricia[0].FuncionVital?.PesoActual);
    this.dataFormGroup.controls['inputAumentoPeso'].setValue(obstetricia[0].FuncionVital?.AumentoPeso);
    this.dataFormGroup.controls['inputPresionSistolicaIzquierda'].setValue(obstetricia[0].FuncionVital?.PresionSistolicaIzquierda);
    this.dataFormGroup.controls['inputPresionDiastolicaIzquierda'].setValue(obstetricia[0].FuncionVital?.PresionDiastolicaIzquierda);
  }

  Guardar(){

    
      for (let c in this.dataFormGroup.controls) {
        this.dataFormGroup.controls[c].markAsTouched();
      }
      
      for (let c in this.dataFormGroup.controls) {
        if (this.dataFormGroup.controls[c].dirty) {
          this.contadorControles++;
        }
      }
      /* console.log("guardar?")
      if (this.dataFormGroup.valid && this.contadorControles == 0) {
            */
          this.AgregarObjeto();

          this.objHistoria.HistorialObstetrico = this.objObstetricia;
          this.objHistoria.IdHistoriaClinica = this.idHistoria;
          console.log("historia guardar", this.objHistoria);
          
          if(this.objHistoria.HistorialObstetrico != null){

              this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
                next: (data) => {
                  this.MostrarNotificacionSuccessModal('El registro se guardó con éxito.', '');
                  this.CerrarModal();
                },
                error: (e) => {
                  console.log('Error: ', e);
                  this.verSpinner = false;
                },
                complete: () => { this.verSpinner = false; }
              });
          }else{
            this.MostrarNotificacionWarning("Ningún servicio seleccionado", "Error");
          }
     
            
      /* }
      else {
        this.buscarConstrolesInvalidos();
        this.MostrarNotificacionErrorPersonalizado('Hay campos obligatorios.', '¡ERROR EN EL PROCESO!')
      } */
  }

  AgregarObjeto()
  {
    let obstetricia = new HistorialObstetricoDTO();
    obstetricia.Paciente = this.paciente;
    obstetricia.NroHcl = this.nroHcl;
    obstetricia.Personal = this.medico;    
    obstetricia.IdPersonal = this.idMedico;
    obstetricia.FechaRegistro = new Date();
    let antecedente = new AntecedenteObstetricoDTO();
    antecedente.G = this.dataFormGroup.controls['inputG'].value;
    antecedente.P = this.dataFormGroup.controls['inputP'].value;
    antecedente.G1 = this.dataFormGroup.controls['inputG1'].value;
    antecedente.G2 = this.dataFormGroup.controls['inputG2'].value;
    antecedente.G3 = this.dataFormGroup.controls['inputG3'].value;
    antecedente.Fur = this.dataFormGroup.controls['inputFur'].value;
    antecedente.FgFur = this.dataFormGroup.controls['inputFgFur'].value;
    antecedente.EgEco = this.dataFormGroup.controls['inputEgEco'].value;
    antecedente.FppFur = this.dataFormGroup.controls['inputFppFur'].value;
    antecedente.FppEco = this.dataFormGroup.controls['inputFppEco'].value;

    let riesgo = new RiesgoObstetricoDTO();
    riesgo.CondicionMedica = this.dataFormGroup.controls['inputCondicionMedicaCronica'].value;
    riesgo.Quirurgico = this.dataFormGroup.controls['inputQuirurgicos'].value;
    riesgo.EnfermedadCongenita = this.dataFormGroup.controls['inputEnfermedadesCongenitas'].value;
    riesgo.Fuma = this.dataFormGroup.controls['inputFumaAlcohol'].value;

    let riesgoActual = new RiesgoActualDTO();
    riesgoActual.PlacentaPrevia = this.dataFormGroup.controls['inputPlacentaPrevia'].value;
    riesgoActual.SobrePeso = this.dataFormGroup.controls['inputSobrepeso'].value;
    riesgoActual.Itu = this.dataFormGroup.controls['inputItu'].value;
    riesgoActual.PresionAlta = this.dataFormGroup.controls['inputPresionAlta'].value;

    let funcionVital = new FuncionVitalObstetriciaDTO();
    funcionVital.Temperatura = this.dataFormGroup.controls['inputTemperatura'].value.toString();
    funcionVital.Fc = this.dataFormGroup.controls['inputFrecuenciaCardiaca'].value.toString();
    funcionVital.PresionSistolica = this.dataFormGroup.controls['inputPresionSistolica'].value.toString();
    funcionVital.PresionDiastolica = this.dataFormGroup.controls['inputPresionDiastolica'].value.toString();
    funcionVital.PresionSistolicaIzquierda = this.dataFormGroup.controls['inputPresionSistolicaIzquierda'].value.toString();
    funcionVital.PresionDiastolicaIzquierda = this.dataFormGroup.controls['inputPresionDiastolicaIzquierda'].value.toString();
    funcionVital.Saturacion = this.dataFormGroup.controls['inputSaturacion'].value.toString();
    funcionVital.Fr = this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].value.toString();
    funcionVital.Talla = this.dataFormGroup.controls['inputTalla'].value.toString();
    funcionVital.Peso = this.dataFormGroup.controls['inputPeso'].value.toString();
    funcionVital.Imc = this.dataFormGroup.controls['inputImc'].value.toString();
    funcionVital.PesoHabitual = this.dataFormGroup.controls['inputPesoHabitual'].value.toString();
    funcionVital.PesoActual = this.dataFormGroup.controls['inputPesoActual'].value.toString();
    funcionVital.AumentoPeso = this.dataFormGroup.controls['inputAumentoPeso'].value.toString();

    let examenPreferencial = new ExamenPreferencialDTO();
    examenPreferencial.AlturaUterina = this.dataFormGroup.controls['inputAlturaUterina'].value.toString();
    examenPreferencial.Lcf = this.dataFormGroup.controls['inputLcf'].value.toString();
    examenPreferencial.MovFetal = this.dataFormGroup.controls['inputMovFetal'].value.toString();
    examenPreferencial.Placente = this.dataFormGroup.controls['inputPlacenta'].value.toString();
    examenPreferencial.Ila = this.dataFormGroup.controls['inputIla'].value.toString();
    examenPreferencial.LogCervix = this.dataFormGroup.controls['inputLongCervix'].value.toString();
    examenPreferencial.Posicion = this.dataFormGroup.controls['inputPosicion'].value.toString();
    examenPreferencial.PesoFetal = this.dataFormGroup.controls['inputPesoFetal'].value.toString();

    obstetricia.Antecedentes = antecedente;
    obstetricia.RiesgosPreExistente = riesgo;
    obstetricia.RiesgoActual = riesgoActual;
    obstetricia.FuncionVital = funcionVital;
    obstetricia.ExamenPreferencial = examenPreferencial;
    let aro = this.dataFormGroup.controls['inputAro'].value;
    if(aro == true){
      obstetricia.Aro = 'SI';
    } else{
      obstetricia.Aro = 'NO';
    }
    obstetricia.AroMotivo = this.dataFormGroup.controls['inputMotivoAro'].value;
    /* let dn = this.dataFormGroup.controls['inputDatoNino'].value;
    if(dn == true){
      obstetricia.DatoNino = 'Niño';
    } else{
      obstetricia.Aro = 'Niña';
    } */
   obstetricia.DatoNino = '-';
    obstetricia.SignosAlarma = this.dataFormGroup.controls['inputSignoAlarma'].value;
    obstetricia.Diagnostico = this.dataFormGroup.controls['inputDiagnostico'].value;
    obstetricia.RecomendacionesGenerales = this.listadoGeneral;
    obstetricia.RecomendacionesEspecificas = this.listadoEspecificos;

    this.objObstetricia.push(obstetricia);
  }

  arocalot(){
    if(this.verMotivoAro==true){
      this.verMotivoAro = false
    }else{
      this.verMotivoAro=true;
    }
  }

  ChangeFur() {
    var fur = this.dataFormGroup.controls['inputFur'].value    
    if (fur != '' && fur != null) {
      fur = moment(fur);
      fur = fur.add(7, 'days');
      fur = fur.subtract(3, 'months');
      fur = fur.add(1, 'years');
      this.dataFormGroup.controls['inputFppFur'].setValue(fur.format('yyyy-MM-DD'));
      this.CalcularEgFur();
    }
  }

  CalcularEgFur() {
    var fur = this.dataFormGroup.controls['inputFur'].value
    var result = 0;
    if (fur != '' && fur != null) {
      var dias = moment(this.fecha_atencion).diff(fur, 'days');
      if (dias >= 0) {
        var x = dias / 7;
        var ex = Math.trunc(x);
        var dx = dias % 7;
        var ey = 0;
        var dy = 0;
        var d = dx + dy;
        var e = ex + ey;
        if (d > 6) {
          var nx = d / 7;
          var enx = Math.trunc(nx);
          var dnx = d % 7;
          e = e + enx;
          result = parseFloat(`${e}.${dnx}`);
        } else {
          result = parseFloat(`${e}.${d}`);
        }
        this.dataFormGroup.controls['inputFgFur'].setValue(result + ' Semanas');
      }

    }
  }

  buscarConstrolesInvalidos() {
    const invalid = [];
    const controls = this.dataFormGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        let element: any = document.querySelector('[formcontrolname="' + name + '"]');
        element.scrollIntoView();
        break;
      }
    }
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    return invalid;
  }

  PintarRangoSignoVital() {

    this.MostrarRangoTemperatura();
    this.MostrarRangoSaturacionOxigeno();
    this.MostrarFrecuenciaCardiaca();
    this.MostrarPrecionArterial();
    this.MostrarPrecionDiastolica();
    this.MostrarRangoFrecuenciaRespiratoria();
  }

  MostrarRangoTemperatura() {    
    let temperatura = this.dataFormGroup.controls['inputTemperatura'].value;
    if (temperatura >= 35 && temperatura <= 37.9) {
      this.temperaturaRango = false
      this.colorEstadoTemp = '';
    } else {
      this.temperaturaRango = true
      this.colorEstadoTemp = '#ff000047';
    }
  }

  MostrarRangoSaturacionOxigeno() {    
    let saturacionOxigeno = this.dataFormGroup.controls['inputSaturacion'].value;
    if (saturacionOxigeno <= 87) {
      this.SaturacionOxigenoRango = false
      this.colorEstadosat = '';
    } else {
      this.SaturacionOxigenoRango = true
      this.colorEstadosat = '#ff000047';
    }
  }

  MostrarRangoFrecuenciaRespiratoria() {    
    let frecuenciaRespiratoria = this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].value;
    if (frecuenciaRespiratoria <= 20) {
      this.FrecuenciaRespiratoriaRango = false
      this.colorEstadores = '';
    } else {
      this.FrecuenciaRespiratoriaRango = true
      this.colorEstadores = '#ff000047';
    }
  }

  MostrarFrecuenciaCardiaca() {    
    let frecuenciaCardiaca = this.dataFormGroup.controls['inputFrecuenciaCardiaca'].value;
    if (frecuenciaCardiaca >= 60 && frecuenciaCardiaca <= 99) {
      this.FrecuenciaCardicaRango = false
      this.colorEstadofrecar = '';
    } else {
      this.FrecuenciaCardicaRango = true
      this.colorEstadofrecar = '#ff000047';
    }
  }

  MostrarPrecionArterial() {    
    let sistolica = this.dataFormGroup.controls['inputPresionSistolica'].value;
    if (sistolica >= 100 && sistolica <= 140) {
      this.PrecionArterialRango = false
      this.colorEstadoprecio = '';
    } else {
      this.PrecionArterialRango = true
      this.colorEstadoprecio = '#ff000047';
    }
  }

  MostrarPrecionDiastolica() {    
    let diastolica = this.dataFormGroup.controls['inputPresionDiastolica'].value;
    if (diastolica >= 60 && diastolica <= 90) {
      this.PrecionArterialRangoDis = false
      this.colorEstadopreArtDis = '';
    } else {
      this.PrecionArterialRangoDis = true
      this.colorEstadopreArtDis = '#ff000047';
    }
  }

  MostrarPrecionArterialIz() {    
    let sistolica = this.dataFormGroup.controls['inputPresionSistolicaIzquierda'].value;
    if (sistolica >= 100 && sistolica <= 140) {
      this.PrecionArterialRangoIz = false
      this.colorEstadoprecioIz = '';
    } else {
      this.PrecionArterialRangoIz = true
      this.colorEstadoprecio = '#ff000047';
    }
  }

  MostrarPrecionDiastolicaIz() {    
    let diastolica = this.dataFormGroup.controls['inputPresionDiastolicaIzquierda'].value;
    if (diastolica >= 60 && diastolica <= 90) {
      this.PrecionArterialRangoDisIz = false
      this.colorEstadopreArtDisIz = '';
    } else {
      this.PrecionArterialRangoDisIz = true
      this.colorEstadopreArtDisIz = '#ff000047';
    }
  }

  CalcularIndiceMasaCorporal() {
    let peso = this.dataFormGroup.controls['inputPeso'].value;
    let talla = this.dataFormGroup.controls['inputTalla'].value;
    if (peso != null && talla != null) {
      this.IMC = peso / (talla * talla);
      this.dataFormGroup.controls['inputImc'].setValue((this.IMC).toFixed(1));
    }
  }

  CalcularAumentoPeso(){
    let actual = this.dataFormGroup.controls['inputPesoActual'].value;
    let habitual = this.dataFormGroup.controls['inputPesoHabitual'].value;
    if (habitual != null && actual != null) {
      let aumento = actual - habitual;
      this.dataFormGroup.controls['inputAumentoPeso'].setValue(aumento.toFixed(1));
    }
  }

  AgregarGeneral(){
    let sstf = this.dataFormGroup.controls['inputRecomendacionGeneral'].value;
    if(sstf != null && sstf != '')
    {
      this.listadoGeneral.push(sstf);
      this.dataFormGroup.controls['inputRecomendacionGeneral'].setValue('');
    }
      
  }

  AgregarEspecificos(){
    let sstf = this.dataFormGroup.controls['inputRecomendacionEspecifica'].value;
    if(sstf != null && sstf != '')
    {
      this.listadoEspecificos.push(sstf);
      this.dataFormGroup.controls['inputRecomendacionEspecifica'].setValue('');
    }
      
  }

  MostrarNotificacionSuccessModal(mensaje: string, titulo: string)
  {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje
    });
  }

  MostrarNotificacionErrorPersonalizado(mensaje: string, titulo: string) {
    this.tituloError = titulo;
    this.mensajeError = mensaje;
    this.verError = true;
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
    this.bsModalHistorialClinico.hide();
    //this.onGuardar();
  }
  
  get Controls() {
    return this.dataFormGroup.controls;
  }
}
