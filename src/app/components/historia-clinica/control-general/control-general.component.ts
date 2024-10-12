import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnamnesisDTO } from '@models/anamnesis';
import { AntecedentesAnamnesisDTO } from '@models/antecedente-anamnesis';
import { CabeceraPacienteDTO } from '@models/cabecera-paciente';
import { DiagnosticoCuidadoDTO } from '@models/diagnostico-cuidado';
import { ExamenFisicoDTO } from '@models/examen-fisico';
import { ExamenRegionalDTO } from '@models/examen-regional';
import { FuncionBiologicaDTO } from '@models/funcion-biologica';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { MedicoAtiendeDTO } from '@models/medico-atiende';
import { PacienteExternoDTO } from '@models/paciente-externo';
import { SignoVitalDTO } from '@models/signo-vital';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { DropdownModule } from 'primeng/dropdown';
import { DatosMonitoreoService } from '@services/datos-monitoreo.service';
import { ControlGeneralDTO } from '@models/control-general';
import { HistoriaService } from '@services/historia.service';
import { RecetaDTO } from '@models/RecetaDTO';
import { OrdenDTO } from '@models/OrdenDTO';
import { MedicoAtencionDTO } from '@models/medico-atiente';
import { UtilitiesService } from '@services/utilities.service';
import { DesplegableDTO } from '@models/depleglable';
import { ComboDTO } from '@models/ComboDTO';


@Component({
  selector: 'app-control-general',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CommonModule
  ],
  templateUrl: './control-general.component.html',
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

export class ControlGeneralComponent implements OnInit {
  dataFormGroup: FormGroup;

  idHistoria:number=0;
  verSpinner:boolean = false;
  objHistoria=new HistoriaCuidadoDTO();
  objAnamnesis = new AnamnesisDTO();
  objFuncionBiologica = new FuncionBiologicaDTO();
  objExamenFisico = new ExamenFisicoDTO();
  objFuncionVital = new SignoVitalDTO();
  objExamenRegional = new ExamenRegionalDTO();
  objDiagnostico : DiagnosticoCuidadoDTO[]=[];
  objHistoriaExterna = new HistoriaExternaDTO();

  objControl : ControlGeneralDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl?:string='';
  fechaHistoria?:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  IMC:number = 0;

  public onGuardar: any;
  comboBanio: ComboKatzDTO[] = [];
  comboVestido: ComboKatzDTO[] = [];
  comboWC: ComboKatzDTO[] = [];
  comboMovilidad: ComboKatzDTO[] = [];
  comboContinencia: ComboKatzDTO[] = [];
  comboAlimentacion: ComboKatzDTO[] = [];

  comboEstado: ComboDTO[] = [];
  comboSiNo: ComboDTO[] = [];
  comboResultadoKatz: ComboDTO[] = [];

  fecha: string='';
  dia: string='';
  lugar: string='';
  numeroTelefono: string='';
  direccionCompleta: string='';
  anios: string='';
  lugarNacio: string ='';
  nombrePresidente: string='';
  primerApellidoMadre: string='';

  constructor(
    private bsModalControlGeneral: BsModalRef,
    private historiaService: HistoriaService,
    private monitoreoService: DatosMonitoreoService,
    private utilitiesService: UtilitiesService
  ) {
    this.dataFormGroup = new FormGroup({
      inputAlergias: new FormControl(),
      inputEscalaKatz: new FormControl(),
      inputTemperatura: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
      inputPresionSistolica: new FormControl(),
      inputSaturacion: new FormControl(),
      inputPeso: new FormControl(),
      inputTalla: new FormControl(),
      inputImc: new FormControl(),
      inputEstadoMentalDetalle: new FormControl(),
      inputEstadoNutricionalDetalle: new FormControl(),
      inputEstadoPsicosocialDetalle: new FormControl(),
      inputEstadoVisionDetalle: new FormControl(),
      inputEstadoAudicion: new FormControl(),
      inputPlanTrabajo: new FormControl(),
      selectBanio: new FormControl(''),
      selectVestido: new FormControl(''),
      selectWC: new FormControl(''),
      selectMovilidad: new FormControl(''),
      selectContinencia: new FormControl(''),
      selectAlimentacion: new FormControl(''),
      inputPresionDiastolica: new FormControl(),
      inputEscalaKatzDetalle: new FormControl(''),
      inputEstadoMental: new FormControl(''),
      inputCaida: new FormControl(''),
      inputCaidaDetalle: new FormControl(''),
      inputEstadoNutricional: new FormControl(''),
      inputEstadoPsicosocial: new FormControl(''),
      inputEstadoVision: new FormControl(''),
      inputEstadoAudicionDetalle: new FormControl(''),
      inputFechaAdecuada: new FormControl(''),
      inputFechaEquivocada: new FormControl(''),
      inputDiaAdecuada: new FormControl(''),
      inputDiaEquivocada: new FormControl(''),
      inputLugarAdecuada: new FormControl(''),
      inputLugarEquivocada: new FormControl(''),
      inputNumeroAdecuada: new FormControl(''),
      inputNumeroEquivocada: new FormControl(''),
      inputDireccionAdecuada: new FormControl(''),
      inputDireccionEquivocada: new FormControl(''),
      inputAniosAdecuada: new FormControl(''),
      inputAniosEquivocada: new FormControl(''),
      inputDondeNacioAdecuada: new FormControl(''),
      inputDondeNacioEquivocada: new FormControl(''),
      inputNombrePresidenteAdecuada: new FormControl(''),
      inputNombrePresidenteEquivocada: new FormControl(''),
      inputPrimerApellidoAdecuada: new FormControl(''),
      inputPrimerApellidoEquivocada: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.CargarDataInicio();
  }

  CargarDataInicio() {
    this.verSpinner = true;
    forkJoin([
      this.monitoreoService.ObtenerBanio(),
      this.monitoreoService.ObtenerVestido(),
      this.monitoreoService.ObtenerWC(),
      this.monitoreoService.ObtenerMovilidad(),
      this.monitoreoService.ObtenerContinencia(),
      this.monitoreoService.ObtenerAlimentacion(),

    ])
      .subscribe(
        data => {
          this.comboBanio = data[0];
          this.comboVestido = data[1];
          this.comboWC = data[2];
          this.comboMovilidad = data[3];
          this.comboContinencia = data[4];
          this.comboAlimentacion = data[5];
          this.verSpinner = false;
        },
        err => {
          console.log(err);
          this.MostrarNotificacionError('Intente de nuevo', 'Error');
          this.verSpinner = false;
        }
      )
  }

  AsignarHistoriaClinicaInterno(historia: HistoriaCuidadoDTO, idHistoria: number){

    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    //this.ObtenerConfiguracion(idHistoria);
    this.AsignarObjetoHistoria(historia);
    this.comboEstado = this.utilitiesService.ObtenerComboSintomaRespiratorio();
    this.comboSiNo = this.utilitiesService.ObtenerSINO();
    this.comboResultadoKatz = this.utilitiesService.ObtenerComboResultadoKatz();
    
  }

  

  ObtenerConfiguracion(idHistoriaClinica: number)
  {
    this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(idHistoriaClinica)
    ])
      .subscribe(
        data => {
          console.log("hcl", data[0]);
          this.AsignarObjetoInicial(data[0]);
          this.AsignarObjetoHistoria(data[0]);
          
          
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

    if(objHistoria.historiaExterna != null)
    {
      let externo = new HistoriaExternaDTO();
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
      this.objAnamnesis = anamnesis;

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
      this.objFuncionBiologica = funcionBiologica;

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
      this.objFuncionVital = funcionVital;
      this.objExamenFisico = examenFisico;
      this.objExamenRegional = examenRegional;
      
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
      this.objDiagnostico = diagnosticoDTO;
      
      externo.Diagnostico = diagnosticoDTO;
      externo.PlanTrabajo = objHistoria.historiaExterna.planTrabajo;
      externo.UrlPdfHistoriaClinica = objHistoria.historiaExterna.urlPdfHistoriaClinica;
      this.objHistoriaExterna = externo;
    }

    let controlGeneral : ControlGeneralDTO[]=[];
    if(objHistoria.controlGeneral != null)
    {
      objHistoria.controlGeneral.forEach((element:any)=>{
        let control = new ControlGeneralDTO();
        control.Paciente =element.paciente;
        control.Alergias =element.alergias;
        control.Temperatura =element.temperatura;
        control.Talla =element.talla;
        control.Peso =element.peso;
        control.EstadoNutricional =element.estadoNutricional;
        control.EstadoNutricionalDetalle =element.estadoNutricionalDetalle;
        control.EstadoPsicosocial =element.estadoPsicosocial;
        control.EstadoPsicosocialDetalle =element.estadoPsicosocialDetalle;
        control.EstadoVision =element.estadoVision;
        control.EstadoVisionDetalle =element.estadoVisionDetalle;
        control.EstadoAudicion =element.estadoAudicion;
        control.EstadoAudicionDetalle =element.estadoAudicionDetalle;
        control.PlanTrabajo =element.planTrabajo;
        controlGeneral.push(control);
      });
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

    

    let historiaCalidad = new HistoriaCuidadoDTO();
    historiaCalidad.cabeceraPaciente = cabecera;
    historiaCalidad.MedicoAtiende = medic;
    historiaCalidad.IdPaciente = objHistoria.idPaciente;
    historiaCalidad.IdHistoriaClinica = objHistoria.idHistoriaClinica;
    historiaCalidad.IdPersonal = objHistoria.idPersonal;
    historiaCalidad.IdMedico = objHistoria.idMedico;
    historiaCalidad.FechaInicioAtencion = objHistoria.fechaInicioAtencion;
    historiaCalidad.FechaFinAtencion = objHistoria.fechaFinAtencion;
    historiaCalidad.Estado = objHistoria.estado;
    historiaCalidad.UsuarioCreacion = objHistoria.usuarioCreacion;
    historiaCalidad.UsuarioModificacion = objHistoria.usuarioModificacion;
    historiaCalidad.FechaCreacion = objHistoria.fechaCreacion;
    historiaCalidad.FechaModificacion = objHistoria.fechaModificacion;
    historiaCalidad.Orden = ordenListado;
    historiaCalidad.Receta = recetaListado;
    historiaCalidad.ControlGeneral = controlGeneral;
    historiaCalidad.HistoriaExterna = objHistoria.historiaExterna;

    this.objHistoria = historiaCalidad;
    
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
  }

  CerrarModal() {
    this.bsModalControlGeneral.hide();
    this.onGuardar();
  }

  AsignarHistoriaClinica(historia:HistoriaCuidadoDTO, idHistoria:number){

    console.log("historia llega", historia);
    this.objHistoria = historia;
    this.idHistoria = idHistoria;
    this.AsignarObjetoHistoria(historia);
    this.comboEstado = this.utilitiesService.ObtenerComboSintomaRespiratorio();
    this.comboSiNo = this.utilitiesService.ObtenerSINO();
    this.comboResultadoKatz = this.utilitiesService.ObtenerComboResultadoKatz();
  }

  AsignarObjetoHistoria(data:any)
  {
    this.verSpinner = true;
    let objHistoria: any = data;
    console.log("asignar",objHistoria);

    this.paciente = this.objHistoria.cabeceraPaciente?.ApellidoMaterno+' '+this.objHistoria.cabeceraPaciente?.ApellidoMaterno+', '+this.objHistoria.cabeceraPaciente?.Nombre;
    this.medico = this.objHistoria.MedicoAtiende?.ApellidoPaterno+' '+this.objHistoria.MedicoAtiende?.ApellidoMaterno+', '+this.objHistoria.MedicoAtiende?.Nombre;
    this.nroHcl = this.objHistoria.cabeceraPaciente?.NumeroDocumento;
    this.fechaHistoria = this.objHistoria.cabeceraPaciente?.FechaAtencion.toString() ;

    this.celularPaciente = objHistoria.cabeceraPaciente.Celular ;

    if(objHistoria.ControlGeneral != null)
      {
        objHistoria.ControlGeneral.forEach((element:any)=>{
          let control = new ControlGeneralDTO();
          control.Paciente = element.Paciente;
          control.FechaRegistro = element.FechaRegistro;
          control.Alergias = element.Alergias;
          control.Banno = new DesplegableDTO();
          control.Banno.Id = element.Banno.Id;
          control.Banno.Nombre = element.Banno.Nombre;
          control.Vestido= new DesplegableDTO();
          control.Vestido.Id = element.Vestido.Id;
          control.Vestido.Nombre = element.Vestido.Nombre;
          control.Wc= new DesplegableDTO();
          control.Wc.Id = element.Wc.Id;
          control.Wc.Nombre = element.Wc.Nombre;
          control.Movilidad= new DesplegableDTO();
          control.Movilidad.Id = element.Movilidad.Id;
          control.Movilidad.Nombre = element.Movilidad.Nombre;
          control.Continencia= new DesplegableDTO();
          control.Continencia.Id = element.Continencia.Id;
          control.Continencia.Nombre = element.Continencia.Nombre;
          control.Alimentacion= new DesplegableDTO();
          control.Alimentacion.Id = element.Alimentacion.Id;
          control.Alimentacion.Nombre = element.Alimentacion.Nombre;
          control.ResultadoEscalaKatz= new DesplegableDTO();
          control.ResultadoEscalaKatz.Id = element.ResultadoEscalaKatz.Id;
          control.ResultadoEscalaKatz.Nombre = element.ResultadoEscalaKatz.Nombre;
          control.DetalleResultadoKatz = element.DetalleResultadoKatz;
          control.Temperatura = element.Temperatura;
          control.Fc = element.Fc;
          control.Fr = element.Fr;
          control.PresionSistolica = element.PresionSistolica;
          control.PresionDiastolica = element.PresionDiastolica;
          control.Saturacion = element.Saturacion;
          control.Peso = element.Peso;
          control.Talla = element.Talla;
          control.Imc = element.Imc;
          control.FechaHoy = element.FechaHoy;
          control.DiaSemana = element.DiaSemana;
          control.LugarEstamos = element.LugarEstamos;
          control.NumeroTelefono = element.NumeroTelefono;
          control.DireccionCompleta = element.DireccionCompleta;
          control.CuantosAnios = element.CuantosAnios;
          control.DondeNacio = element.DondeNacio;
          control.NombrePresidente = element.NombrePresidente;
          control.PrimerApellidoMadre = element.PrimerApellidoMadre;
          control.ValoracionMental = element.ValoracionMental;
          control.ValoracionMentalDetalle = element.ValoracionMentalDetalle;
          control.Caida = element.Caida;
          control.CaidaDetalle = element.CaidaDetalle;
          control.EstadoNutricional = new DesplegableDTO();
          control.EstadoNutricional.Id = element.EstadoNutricional.Id;
          control.EstadoNutricional.Nombre = element.EstadoNutricional.Nombre;
          control.EstadoNutricionalDetalle = element.EstadoNutricionalDetalle;
          control.EstadoPsicosocial = new DesplegableDTO();
          control.EstadoPsicosocial.Id = element.EstadoPsicosocial.Id;
          control.EstadoPsicosocial.Nombre = element.EstadoPsicosocial.Nombre;
          control.EstadoPsicosocialDetalle = element.EstadoPsicosocialDetalle;
          control.EstadoVision = new DesplegableDTO();
          control.EstadoVision.Id = element.EstadoVision.Id;
          control.EstadoVision.Nombre = element.EstadoVision.Nombre;
          control.EstadoVisionDetalle = element.EstadoVisionDetalle;
          control.EstadoAudicion = new DesplegableDTO();
          control.EstadoAudicion.Id = element.EstadoAudicion.Id;
          control.EstadoAudicion.Nombre = element.EstadoAudicion.Nombre;
          control.EstadoAudicionDetalle = element.EstadoAudicionDetalle;
          control.PlanTrabajo = element.PlanTrabajo;
  
  
          this.objControl.push(control);
        });
      }

    
  }

  Guardar(){

    this.AsignarValores();
    if(this.objControl.length==0)
    {
      this.MostrarNotificacionError("Valores Imcompletos", "Error");
    }
    else{
      this.objHistoria.IdHistoriaClinica = this.idHistoria;
      this.objHistoria.ControlGeneral = this.objControl;
      this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
        next: (data) => {
          this.MostrarNotificacionSuccessModal('El control se guardó con éxito.', '');
          this.CerrarModal();
        },
        error: (e) => {
          console.log('Error: ', e);
          this.verSpinner = false;
        },
        complete: () => { this.verSpinner = false; }
      });
    }
    

    console.log("historia guardar", this.objHistoria);

  }

  AsignarValores()
  {
    let controlGeneral = new ControlGeneralDTO();
    controlGeneral.Paciente = this.paciente ;
    controlGeneral.FechaRegistro = new Date();
    controlGeneral.Alergias = this.dataFormGroup.controls['inputAlergias'].value ;
    let b = new DesplegableDTO();
    b.Id = this.dataFormGroup.controls['selectBanio'].value;
    let _b = this.comboBanio.filter(s => s.id == b.Id)
    if(_b != null)
      b.Nombre = _b[0]['nombre'];
    controlGeneral.Banno = b;

    let v = new DesplegableDTO();
    v.Id = this.dataFormGroup.controls['selectVestido'].value;
    let _v = this.comboVestido.filter(s => s.id == v.Id)
    if(_v != null)
      v.Nombre = _v[0]['nombre'];
    controlGeneral.Vestido = v;

    let wc = new DesplegableDTO();
    wc.Id = this.dataFormGroup.controls['selectWC'].value;
    let _wc = this.comboWC.filter(s => s.id == wc.Id)
    if(_wc != null)
      wc.Nombre = _wc[0]['nombre'];
    controlGeneral.Wc = wc;

    let movi = new DesplegableDTO();
    movi.Id = this.dataFormGroup.controls['selectMovilidad'].value;
    let _movi = this.comboMovilidad.filter(s => s.id == movi.Id)
    if(_movi != null)
      movi.Nombre = _movi[0]['nombre'];
    controlGeneral.Movilidad = movi;

    let conti = new DesplegableDTO();
    conti.Id = this.dataFormGroup.controls['selectContinencia'].value;
    let _conti = this.comboContinencia.filter(s => s.id == conti.Id)
    if(_conti != null)
      conti.Nombre = _conti[0]['nombre'];
    controlGeneral.Continencia = conti;

    let ali = new DesplegableDTO();
    ali.Id = this.dataFormGroup.controls['selectAlimentacion'].value;
    let _ali = this.comboAlimentacion.filter(s => s.id == ali.Id)
    if(_ali != null)
      ali.Nombre = _ali[0]['nombre'];
    controlGeneral.Alimentacion = ali;

    let res = new DesplegableDTO();
    res.Id = this.dataFormGroup.controls['inputEscalaKatz'].value;
    let _res = this.comboResultadoKatz.filter(s => s.id == res.Id)
    if(_res != null)
      res.Nombre = _res[0]['nombre'];
    controlGeneral.ResultadoEscalaKatz = res;

    controlGeneral.DetalleResultadoKatz = this.dataFormGroup.controls['inputEscalaKatzDetalle'].value ;

    controlGeneral.Temperatura = this.dataFormGroup.controls['inputTemperatura'].value.toString();
    controlGeneral.Fc = this.dataFormGroup.controls['inputFrecuenciaCardiaca'].value.toString();
    controlGeneral.Fr = this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].value.toString();
    controlGeneral.PresionSistolica = this.dataFormGroup.controls['inputPresionSistolica'].value.toString();
    controlGeneral.PresionDiastolica = this.dataFormGroup.controls['inputPresionDiastolica'].value.toString();
    controlGeneral.Saturacion = this.dataFormGroup.controls['inputSaturacion'].value.toString();
    controlGeneral.Peso = this.dataFormGroup.controls['inputPeso'].value.toString();
    controlGeneral.Talla = this.dataFormGroup.controls['inputTalla'].value.toString();
    controlGeneral.Imc = this.dataFormGroup.controls['inputImc'].value.toString();
    controlGeneral.FechaHoy = this.fecha;
    controlGeneral.DiaSemana = this.dia;
    controlGeneral.LugarEstamos = this.lugar;
    controlGeneral.NumeroTelefono = this.numeroTelefono;
    controlGeneral.DireccionCompleta = this.direccionCompleta;
    controlGeneral.CuantosAnios = this.anios;
    controlGeneral.DondeNacio = this.lugarNacio;
    controlGeneral.NombrePresidente = this.nombrePresidente;
    controlGeneral.PrimerApellidoMadre = this.primerApellidoMadre;

    let val = new DesplegableDTO();
    val.Id = this.dataFormGroup.controls['inputEstadoMental'].value;
    let _val = this.comboEstado.filter(s => s.id == val.Id)
    if(_val != null)
      val.Nombre = _val[0]['nombre'];
    controlGeneral.ValoracionMental = val;
    controlGeneral.ValoracionMentalDetalle = this.dataFormGroup.controls['inputEstadoMentalDetalle'].value;

    let cai = new DesplegableDTO();
    cai.Id = this.dataFormGroup.controls['inputCaida'].value;
    let _cai = this.comboSiNo.filter(s => s.id == cai.Id)
    if(_cai != null)
      cai.Nombre = _cai[0]['nombre'];
    controlGeneral.Caida = cai;
    controlGeneral.CaidaDetalle = this.dataFormGroup.controls['inputCaidaDetalle'].value;

    let nut = new DesplegableDTO();
    nut.Id = this.dataFormGroup.controls['inputEstadoNutricional'].value;
    let _nut = this.comboEstado.filter(s => s.id == nut.Id)
    if(_nut != null)
      nut.Nombre = _nut[0]['nombre'];
    controlGeneral.EstadoNutricional = nut;
    controlGeneral.EstadoNutricionalDetalle = this.dataFormGroup.controls['inputEstadoNutricionalDetalle'].value;

    let psi = new DesplegableDTO();
    psi.Id = this.dataFormGroup.controls['inputEstadoPsicosocial'].value;
    let _psi = this.comboEstado.filter(s => s.id == psi.Id)
    if(_psi != null)
      psi.Nombre = _psi[0]['nombre'];
    controlGeneral.EstadoPsicosocial = psi;
    controlGeneral.EstadoPsicosocialDetalle = this.dataFormGroup.controls['inputEstadoPsicosocialDetalle'].value;

    let vis = new DesplegableDTO();
    vis.Id = this.dataFormGroup.controls['inputEstadoVision'].value;
    let _vis = this.comboEstado.filter(s => s.id == vis.Id)
    if(_vis != null)
      vis.Nombre = _vis[0]['nombre'];
    controlGeneral.EstadoVision = vis;
    controlGeneral.EstadoVisionDetalle = this.dataFormGroup.controls['inputEstadoVisionDetalle'].value;

    let audi = new DesplegableDTO();
    audi.Id = this.dataFormGroup.controls['inputEstadoAudicion'].value;
    let _audi = this.comboEstado.filter(s => s.id == audi.Id)
    if(_audi != null)
      audi.Nombre = _audi[0]['nombre'];
    controlGeneral.EstadoAudicion = audi;
    controlGeneral.EstadoAudicionDetalle = this.dataFormGroup.controls['inputEstadoAudicionDetalle'].value;
    controlGeneral.PlanTrabajo = this.dataFormGroup.controls['inputPlanTrabajo'].value;

    this.objControl.push(controlGeneral);
    console.log(this.objControl)
  }

  CalcularIndiceMasaCorporal(){
    let peso = this.dataFormGroup.controls['inputPeso'].value;
    let talla = this.dataFormGroup.controls['inputTalla'].value;
    if(peso != null && talla != null){
      this.IMC = peso/(talla*talla);
      this.dataFormGroup.controls['inputImc'].setValue((this.IMC).toFixed(1));
    }
  }

  AsignarFecha(numero:number){
   if(numero==1){
    this.fecha = 'Adecuado';
   }else{
    this.fecha = 'Equivocada';
   }
  }

  AsignarDia(numero:number){
    if(numero==1){
      this.dia = 'Adecuado';
     }else{
      this.dia = 'Equivocada';
     }
  }

  AsignarLugar(numero:number){
    if(numero==1){
      this.lugar = 'Adecuado';
     }else{
      this.lugar = 'Equivocada';
     }
  }

  AsignarNumero(numero:number){
    if(numero==1){
      this.numeroTelefono = 'Adecuado';
     }else{
      this.numeroTelefono = 'Equivocada';
     }
  }

  AsignarDireccion(numero:number){
    if(numero==1){
      this.direccionCompleta = 'Adecuado';
     }else{
      this.direccionCompleta = 'Equivocada';
     }
  }

  AsignarAnios(numero:number){
    if(numero==1){
      this.anios = 'Adecuado';
     }else{
      this.anios = 'Equivocada';
     }
  }

  AsignarLugarNacio(numero:number){
    if(numero==1){
      this.lugarNacio = 'Adecuado';
     }else{
      this.lugarNacio = 'Equivocada';
     }
  }

  AsignarPresidente(numero:number){
    if(numero==1){
      this.nombrePresidente = 'Adecuado';
     }else{
      this.nombrePresidente = 'Equivocada';
     }
  }

  AsignarPrimerApellido(numero:number){
    if(numero==1){
      this.primerApellidoMadre = 'Adecuado';
     }else{
      this.primerApellidoMadre = 'Equivocada';
     }
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
}
