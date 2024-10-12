import { Component, OnInit } from '@angular/core';
import { elementAt, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { AnamnesisDTO } from '@models/anamnesis';
import { FuncionBiologicaDTO } from '@models/funcion-biologica';
import { ExamenFisicoDTO } from '@models/examen-fisico';
import { SignoVitalDTO } from '@models/signo-vital';
import { ExamenRegionalDTO } from '@models/examen-regional';
import { DiagnosticoCuidadoDTO } from '@models/diagnostico-cuidado';
import { HistoriaExternaDTO } from '@models/historia-externa';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { CabeceraPacienteDTO } from '@models/cabecera-paciente';
import { MedicoAtiendeDTO } from '@models/medico-atiende';
import { PacienteExternoDTO } from '@models/paciente-externo';
import { AntecedentesAnamnesisDTO } from '@models/antecedente-anamnesis';
import { ControlGeneralDTO } from '@models/control-general';

@Component({
  selector: 'app-detalle-estado-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './detalle-estado-paciente.component.html',
  styleUrl: './detalle-estado-paciente.component.css'
})
export class DetalleEstadoPacienteComponent implements OnInit{

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
  objControlGeneral : ControlGeneralDTO[]=[];

  paciente:string ='';
  medico:string='';
  nroHcl:string='';
  fechaHistoria:string='';
  fechaNacimientoPaciente:string='';
  celularPaciente:string='';
  emailPaciente:string='';
  direccionPaciente:string='';
  procedencia:string='';

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private historiaService: HistoriaService
  ){

  }

  ngOnInit(): void {
    
  }


  AsignarObjetoListaPaciente(idHistoria:number)
  {
    this.idHistoria=idHistoria;
    this.ObtenerConfiguracion();
  }

  ObtenerConfiguracion() {
    this.verSpinner = true;    
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(this.idHistoria)
    ])
      .subscribe(
        data => {
          console.log("hcl", data[0]);
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
    this.paciente = objHistoria.historiaExterna.paciente.apellidoPaterno+' '+objHistoria.historiaExterna.paciente.apellidoMaterno+', '+objHistoria.historiaExterna.paciente.nombres;
    this.medico = objHistoria.historiaExterna.medico.apellidoPaterno+' '+objHistoria.historiaExterna.medico.apellidoMaterno+', '+objHistoria.historiaExterna.medico.nombres;
    this.nroHcl = objHistoria.historiaExterna.paciente.numeroDocumento;
    this.fechaHistoria = objHistoria.fechaInicioAtencion ;
    this.fechaNacimientoPaciente = objHistoria.historiaExterna.fechaNacimiento;
    this.celularPaciente = objHistoria.historiaExterna.paciente.celular ;
    this.emailPaciente = objHistoria.historiaExterna.paciente.email ;
    this.direccionPaciente = objHistoria.historiaExterna.paciente.direccion ;
    this.procedencia = objHistoria.historiaExterna.razonSocial;


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

    let controlGeneral : ControlGeneralDTO[]=[];
    if(objHistoria.controlGeneral != null)
    {
      objHistoria.controlGeneral.forEach((element:any)=>{
        let control = new ControlGeneralDTO();
        control.Paciente = element.paciente ;
        control.Alergias = element.alergias ;

        control.Talla = element.talla ;
        control.Peso = element.peso ;

        control.EstadoNutricional = element.estadoNutricional ;
        control.EstadoNutricionalDetalle = element.estadoNutricionalDetalle ;
        control.EstadoPsicosocial = element.estadoPsicosocial ;
        control.EstadoPsicosocialDetalle = element.estadoPsicosocialDetalle ;
        control.EstadoVision = element.estadoVision ;
        control.EstadoVisionDetalle = element.estadoVisionDetalle ;
        control.EstadoAudicion = element.estadoAudicion ;
        control.EstadoAudicionDetalle = element.estadoAudicionDetalle ;
        control.PlanTrabajo = element.planTrabajo ;

        controlGeneral.push(control);
      });
      
    }
    this.objControlGeneral = controlGeneral;
    console.log("ctrol", this.objControlGeneral)

    externo.Diagnostico = diagnosticoDTO;
    externo.PlanTrabajo = objHistoria.historiaExterna.planTrabajo;
    externo.UrlPdfHistoriaClinica = objHistoria.historiaExterna.urlPdfHistoriaClinica;
    this.objHistoriaExterna = externo;

    let historiaCalidad = new HistoriaCuidadoDTO();
    historiaCalidad.cabeceraPaciente = cabecera;
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
    historiaCalidad.HistoriaExterna = objHistoria.historiaExterna;

    this.objHistoria = historiaCalidad;

    console.log("historia",this.objHistoria.HistoriaExterna);
    
  }


  CerrarModal() {
    this.modalRef.hide();
    //this.onGuardar();
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
