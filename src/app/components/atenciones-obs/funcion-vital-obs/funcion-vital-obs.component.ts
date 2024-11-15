import { CommonModule  } from '@angular/common';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { elementAt, filter, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HistoriaService } from '@services/historia.service';
import { SettingsService } from '@services/settings.service';
import { HistoriaCuidadoDTO } from '@models/historia-cuidado';
import { ExamenPreferencialDTO } from '@models/examen-preferencial';
import { FuncionVitalObstetriciaDTO } from '@models/funcion-vital-obstetricia';
import { RiesgoActualDTO } from '@models/riesgo-actual';
import { RiesgoObstetricoDTO } from '@models/riesgo-obstetrico';
import { AntecedenteObstetricoDTO } from '@models/antecedente-obstetrico';
import { HistorialObstetricoDTO } from '@models/historial-obstetrico';

@Component({
  selector: 'app-funcion-vital-obs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './funcion-vital-obs.component.html',
  styleUrl: './funcion-vital-obs.component.css'
})
export class FuncionVitalObsComponent implements OnInit {

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

  constructor(
    private modalFuncion: BsModalRef,
    private modalService: BsModalService,
    private historiaService: HistoriaService,
    private settingService: SettingsService
  ){
    this.dataFormGroup = new FormGroup({
      inputPresionArterial: new FormControl(),
      inputFrecuenciaCardiaca: new FormControl(),
      inputFrecuenciaRespiratoria: new FormControl(),
    });
  }
  ngOnInit(): void {
    
  }
  CerrarModal() {
    this.modalFuncion.hide();
    //this.onGuardar();
  }
  AsignarHistoriaClinica(idHistoria:number){
    
    this.idHistoria = idHistoria;
    forkJoin([
      this.historiaService.ObtenerHistoriaClinica(idHistoria),
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
      this.MostrarDatos(obstetricia);
    }


  }

  MostrarDatos(obstetricia:HistorialObstetricoDTO[]){
    console.log("objObste", obstetricia)

    this.dataFormGroup.controls['inputFrecuenciaCardiaca'].setValue(obstetricia[0].FuncionVital?.Fc);
    this.dataFormGroup.controls['inputPresionArterial'].setValue(obstetricia[0].FuncionVital?.PresionSistolica+' - '+obstetricia[0].FuncionVital?.PresionDiastolica);
    this.dataFormGroup.controls['inputFrecuenciaRespiratoria'].setValue(obstetricia[0].FuncionVital?.Fr);

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
