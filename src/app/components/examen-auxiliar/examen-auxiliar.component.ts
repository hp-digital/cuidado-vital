import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboDTO } from '@models/ComboDTO';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaService } from '@services/historia.service';
import { ControlGeneralDTO } from '@models/control-general';
import { DiagnosticoCuidadoDTO } from '@models/diagnostico-cuidado';
import { ExamenRegionalDTO } from '@models/examen-regional';
import { SignoVitalDTO } from '@models/signo-vital';
import { ExamenFisicoDTO } from '@models/examen-fisico';
import { FuncionBiologicaDTO } from '@models/funcion-biologica';
import { AntecedentesAnamnesisDTO } from '@models/antecedente-anamnesis';
import { AnamnesisDTO } from '@models/anamnesis';
import { PacienteExternoDTO } from '@models/paciente-externo';
import { MedicoAtiendeDTO } from '@models/medico-atiende';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { CabeceraPacienteDTO } from '@models/cabecera-paciente';
import { ServicioServiceService } from '@services/servicio.service.service';
import { ListadoCatalogoOrdenDTO } from '@models/listado-catalogo-orden';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OrdenDTO } from '@models/OrdenDTO';
import { RecetaDTO } from '@models/RecetaDTO';
import { SettingsService } from '@services/settings.service';
import { MedicoAtencionDTO } from '@models/medico-atiente';
import { DesplegableDTO } from '@models/depleglable';
import { ControlGlucosaDTO } from '@models/control-glucosa';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
import { ControlPresionDTO } from '@models/control-presion';
import { ControlEpocDTO } from '@models/control-epoc';
import { HistoriaPrimeraAtencionDTO } from '@models/primera-atencion';
import { DiagnosticoPrimeraAtencionDTO } from '@models/diagnostico-primera-atencion';
import { HojaMonitoreoSignosDTO } from '@models/hoja-monitoreo';
import { SignoVitalHojaDTO } from '@models/signo-vital-hoja';
import { EvaluacionDTO } from '@models/evaluacion-nota';
import { SoapieDTO } from '@models/soapie';
import { SignoVitalNotaDTO } from '@models/signo-vital-notal';
import { NotaEnfermeraDTO } from '@models/nota-enfermera';
import { BalanceHidricoDetalleDTO } from '@models/balance-hidrico-detalle';
import { BalanceHidricoEgresoDTO } from '@models/balance-hidrico-egreso';
import { BalanceHidricoIngresoDTO } from '@models/balance-hidrico-ingresos';
import { BalanceHidricoTurnoDTO } from '@models/balance-hidrico-turno';
import { BalanceHidricoDTO } from '@models/balance-hidrico';

@Component({
  selector: 'app-examen-auxiliar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule, AutoCompleteModule],
  templateUrl: './examen-auxiliar.component.html',
  styleUrl: './examen-auxiliar.component.css'
})
export class ExamenAuxiliarComponent implements OnInit {

  dataFormGroup: FormGroup;

  comboExamenes: ComboDTO[]=[];
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
  objDiagnosticoPrimer : DiagnosticoPrimeraAtencionDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl:string='';
  fechaHistoria:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';
  idRol:number=0;

  fechaActual:string='';

  comboCatalogoOrden: ListadoCatalogoOrdenDTO[]=[];
  servicios: any[] = [];
  selectedServicio: any; // Para almacenar el objeto seleccionado
  idServicio:number=0;
  listadoOrden: OrdenDTO[]=[];

  constructor(
    private bsModalExamenAuxiliar: BsModalRef,
    private modalService: BsModalService,
    private historiaService: HistoriaService,
    private servicioService: ServicioServiceService,
    private settings : SettingsService
  ){
    this.dataFormGroup = new FormGroup({
      inputServicio: new FormControl(),
      inputTipo: new FormControl(),
      inputEstudio: new FormControl(),
      inputIndicaciones: new FormControl(),
      selectDuracionDetalle: new FormControl(),
      selectVia: new FormControl(),
      textIndicaciones: new FormControl()
    });
  }

  ngOnInit(): void {
    this.idRol=this.settings.getUserSetting('idRol');
    this.fechaActual = moment().format('DD/MM/YYYY');
  }

  AsignarObjetoListaPaciente(idHistoriaClinica:number){
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
          this.comboExamenes = data[1];
          this.comboCatalogoOrden = data[2];
          this.verSpinner = false;
        },
        err => {
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
          this.verSpinner = false;
        }
      );
  }

  filterServicios(event: any) {
    const query = event.query;
    this.servicios = this.comboCatalogoOrden.filter(s => s.servicio.toLowerCase().includes(query.toLowerCase()));
    
  }

  Agregar(){
    if(this.selectedServicio != null)
    {
      this.idServicio = this.selectedServicio.id
    }
    
    let resultado = this.comboCatalogoOrden.filter(s => s.id == this.idServicio );
    if (resultado.length != 0)
    {
      this.dataFormGroup.controls['inputTipo'].setValue(resultado[0]['clasificacion']);
      this.dataFormGroup.controls['inputEstudio'].setValue(resultado[0]['servicio']);
    }
        
  }

  AgregarReceta(){
    let indice = this.listadoOrden.length;


    let orden = new OrdenDTO();
    orden.Indice = indice+1;
    orden.IdServicio = this.idServicio
    orden.Servicio = this.dataFormGroup.controls['inputEstudio'].value;
    orden.Tipo =this.dataFormGroup.controls['inputTipo'].value;
    orden.Indicaciones = this.dataFormGroup.controls['inputIndicaciones'].value;
    orden.Fecha = new Date();

    this.listadoOrden.push(orden);
    this.LimpiarOrden();
  }

  LimpiarOrden(){
    this.idServicio=0
    this.selectedServicio=[];

    this.dataFormGroup.controls['inputEstudio'].setValue('');
    this.dataFormGroup.controls['inputTipo'].setValue('');
    this.dataFormGroup.controls['inputIndicaciones'].setValue('');
  }

  AsignarObjetoInicial(data:any){
    this.verSpinner = true;
    let objHistoria: any = data;
    this.paciente = objHistoria.cabeceraPaciente.apellidoPaterno+' '+objHistoria.cabeceraPaciente.apellidoMaterno+', '+objHistoria.cabeceraPaciente.nombre;
    this.nroHcl = objHistoria.cabeceraPaciente.numeroDocumento;
    this.fechaHistoria = objHistoria.cabeceraPaciente.fechaInicioAtencion ;
    this.celularPaciente = objHistoria.cabeceraPaciente.celular ;
  

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
      this.objDiagnosticoPrimer.push(diag);
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
        receta.Fecha = element.fecha;

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
        orden.Fecha = element.fecha;
        ordenListado.push(orden);
      });
    }
    this.listadoOrden = ordenListado;

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
    historiaCalidad.ControlGeneral = controlGeneral
    historiaCalidad.Orden = ordenListado;
    historiaCalidad.Receta = recetaListado;
    historiaCalidad.ControlPresion = controlPresion;
    historiaCalidad.ControlGlucosa = controlGlucosa;
    historiaCalidad.ControlEpoc = controlEpoc;
    historiaCalidad.HistoriaExterna = objHistoria.historiaExterna;
    historiaCalidad.PrimeraAtencion = primeraAtencion;
    historiaCalidad.HojaMonitoreoSignos = hojaMonitoreo;
    historiaCalidad.NotaEnfermera = notaEnfermera;
    historiaCalidad.BalanceHidrico = balance;

    this.objHistoria = historiaCalidad;
    
  }

  Guardar(){
    this.objHistoria.Orden = this.listadoOrden;
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    console.log("historia guardar", this.objHistoria);
    
    if(this.listadoOrden.length>0){

        this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
          next: (data) => {
            this.MostrarNotificacionSuccessModal('La orden se guardó con éxito.', '');
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
    this.bsModalExamenAuxiliar.hide();
    //this.onGuardar();
  }
}
