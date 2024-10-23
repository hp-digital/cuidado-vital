import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnamnesisDTO } from '@models/anamnesis';
import { DiagnosticoCuidadoDTO } from '@models/diagnostico-cuidado';
import { ExamenFisicoDTO } from '@models/examen-fisico';
import { ExamenRegionalDTO } from '@models/examen-regional';
import { FuncionBiologicaDTO } from '@models/funcion-biologica';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { SignoVitalDTO } from '@models/signo-vital';
import { HistoriaService } from '@services/historia.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AntecedentesAnamnesisDTO } from '@models/antecedente-anamnesis';
import { PacienteExternoDTO } from '@models/paciente-externo';
import { MedicoAtiendeDTO } from '@models/medico-atiende';
import { CabeceraPacienteDTO } from '@models/cabecera-paciente';
import { ComboDTO } from '@models/ComboDTO';
import { RecetaDTO } from '@models/RecetaDTO';
import { ControlGeneralDTO } from '@models/control-general';
import { OrdenDTO } from '@models/OrdenDTO';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SettingsService } from '@services/settings.service';
import { MedicoAtencionDTO } from '@models/medico-atiente';
import { ControlGlucosaDTO } from '@models/control-glucosa';
import { DesplegableDTO } from '@models/depleglable';
import { ControlPresionDTO } from '@models/control-presion';
import { MedidasAntropometricasDTO } from '@models/medidas-antropometricas';
import { ControlEpocDTO } from '@models/control-epoc';

@Component({
  selector: 'app-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule, AutoCompleteModule],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.css'
})
export class RecetaComponent implements OnInit {

  dataFormGroup: FormGroup;

  comboMedicamento: ComboDTO[]=[];
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

  idMedicamento:number=0;
  nombreMedicamento:string='';

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

  listadoRecetaDTO: RecetaDTO[] = [];

  medicamentos: any[] = [];
  selectedMedicamento: any; // Para almacenar el objeto seleccionado

  constructor(
    private modalService: BsModalService,
    private bsModalReceta: BsModalRef,
    private historiaService: HistoriaService,
    private settings : SettingsService
  ){
    this.dataFormGroup = new FormGroup({
      selectBuscarMedicamento: new FormControl(),
      inputNombreMedicamento: new FormControl(),
      inputDosis: new FormControl(),
      inputDuracion: new FormControl(),
      selectDuracionDetalle: new FormControl(),
      selectVia: new FormControl(),
      textIndicaciones: new FormControl()
    });
  }

  ngOnInit(): void {
    this.idRol=this.settings.getUserSetting('idRol');
    this.fechaActual = moment().format('DD/MM/YYYY');
  }
  CerrarModal() {
    this.bsModalReceta.hide();
    //this.onGuardar();
  }

  filterMedicamentos(event: any) {
    const query = event.query;
    this.medicamentos = this.comboMedicamento.filter(s => s.nombre.toLowerCase().includes(query.toLowerCase()));
    
  }

  Agregar(){
    if(this.selectedMedicamento != null)
    {
      this.idMedicamento = this.selectedMedicamento.id
    }
    
    let resultado = this.comboMedicamento.filter(s => s.id == this.idMedicamento );
    if (resultado.length != 0)
    {
      this.dataFormGroup.controls['inputNombreMedicamento'].setValue(resultado[0]['nombre']);
    }
        
  }

  AgregarListadoReceta()
  {
    let indice = this.listadoRecetaDTO?.length;
    let idMedicamento =  this.dataFormGroup.controls['selectBuscarMedicamento'].value;
    let nombreMedicamento =  this.dataFormGroup.controls['inputNombreMedicamento'].value;
    let dosis =  this.dataFormGroup.controls['inputDosis'].value;
    let duracion =  this.dataFormGroup.controls['inputDuracion'].value;
    let duracionDetalle =  this.dataFormGroup.controls['selectDuracionDetalle'].value;
    let via =  this.dataFormGroup.controls['selectVia'].value;
    let indicaciones =  this.dataFormGroup.controls['textIndicaciones'].value;

    let receta = new RecetaDTO();
    receta.Indice =indice;
    receta.IdMedicamento =this.idMedicamento;
    receta.NombreMedicamento =nombreMedicamento;
    receta.Dosis =dosis;
    receta.Duracion =duracion;
    receta.DuracionDetalle =duracionDetalle;
    receta.Via =via;
    receta.Indicaciones =indicaciones;

    this.listadoRecetaDTO.push(receta);
    this.LimpiarMedicacion();
  }
  LimpiarMedicacion() {
    this.dataFormGroup.controls['selectBuscarMedicamento'].setValue('');
    this.dataFormGroup.controls['inputNombreMedicamento'].setValue('');
    this.dataFormGroup.controls['inputDosis'].setValue('');
    this.dataFormGroup.controls['inputDuracion'].setValue('');
    this.dataFormGroup.controls['selectDuracionDetalle'].setValue('');
    this.dataFormGroup.controls['selectVia'].setValue('');
    this.dataFormGroup.controls['textIndicaciones'].reset();
    this.idMedicamento = 0;

  }

  cambiarNombreMedicamento($event: any) {
      this.idMedicamento = this.dataFormGroup.controls['selectBuscarMedicamento'].value;
      let resultado = this.comboMedicamento.filter(f => f.id == this.idMedicamento );
      if (resultado.length != 0)
        this.dataFormGroup.controls['inputNombreMedicamento'].setValue(resultado[0]['nombre']);
  }

  AsignarObjetoListaPaciente(idHistoriaClinica:number){
    this.idHistoria=idHistoriaClinica;
    this.ObtenerConfiguracion();
  }

  ObtenerConfiguracion() {
    this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(this.idHistoria),
      this.historiaService.ObtenerMedicamento()
    ])
      .subscribe(
        data => {
          console.log("hcl", data[0]);
          this.AsignarObjetoInicial(data[0]);
          this.comboMedicamento = data[1];
          
          
          this.verSpinner = false;
        },
        err => {
          this.MostrarNotificacionError('Intente de nuevo.', '¡ERROR EN EL PROCESO!')
          this.verSpinner = false;
        }
      );
  }

  Guardar(){
    this.objHistoria.Receta = this.listadoRecetaDTO;
    this.objHistoria.IdHistoriaClinica = this.idHistoria;
    console.log("historia guardar", this.objHistoria);
    
    if(this.listadoRecetaDTO.length>0){

        this.historiaService.ActualizarHistoria(this.objHistoria).subscribe({
          next: (data) => {
            this.MostrarNotificacionSuccessModal('La receta se guardó con éxito.', '');
            this.CerrarModal();
          },
          error: (e) => {
            console.log('Error: ', e);
            this.verSpinner = false;
          },
          complete: () => { this.verSpinner = false; }
        });
    }else{
      this.MostrarNotificacionWarning("Ningún medicamento registrado", "Error");
    }

  }

  AsignarObjetoInicial(data:any){
    this.verSpinner = true;
    let objHistoria: any = data;
    console.log("obj", objHistoria);
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
    this.listadoRecetaDTO = recetaListado;


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

    this.objHistoria = historiaCalidad;
    
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
