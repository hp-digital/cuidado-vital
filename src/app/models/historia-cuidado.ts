import { BalanceHidricoDTO } from "./balance-hidrico";
import { CabeceraPacienteDTO } from "./cabecera-paciente";
import { ControlEpocDTO } from "./control-epoc";
import { ControlGeneralDTO } from "./control-general";
import { ControlGlucosaDTO } from "./control-glucosa";
import { ControlPreNatalDTO } from "./control-prenatal";
import { ControlPresionDTO } from "./control-presion";
import { HistoriaExternaDTO } from "./historia-externa";
import { HistorialObstetricoDTO } from "./historial-obstetrico";
import { HojaMonitoreoSignosDTO } from "./hoja-monitoreo";
import { MedicoAtencionDTO } from "./medico-atiente";
import { NotaEnfermeraDTO } from "./nota-enfermera";
import { OrdenDTO } from "./OrdenDTO";
import { HistoriaPrimeraAtencionDTO } from "./primera-atencion";
import { RecetaDTO } from "./RecetaDTO";
import { SeguimientoAnalisisDTO } from "./segumiento-analisis";

export class HistoriaCuidadoDTO{
    cabeceraPaciente?:CabeceraPacienteDTO;
    MedicoAtiende?:MedicoAtencionDTO;
    IdPaciente!: number;
    IdHistoriaClinica?: number;
    IdPersonal?: number;
    IdMedico!: number;
    IdEspecialidad?:number;
    FechaInicioAtencion!:Date;
    FechaFinAtencion?:Date;
    IdHistoriaEstado?: number;
    Estado!:boolean;
    UsuarioCreacion!:string;
    UsuarioModificacion!:string;
    FechaCreacion!:Date;
    FechaModificacion!:Date;
    ControlPresion?:ControlPresionDTO[];
    ControlGeneral?:ControlGeneralDTO[];
    ControlGlucosa?:ControlGlucosaDTO[];
    ControlEpoc?:ControlEpocDTO[];
    Receta?:RecetaDTO[];
    Orden?:OrdenDTO[];
    HistoriaExterna?:HistoriaExternaDTO;
    PrimeraAtencion?:HistoriaPrimeraAtencionDTO;
    HojaMonitoreoSignos?:HojaMonitoreoSignosDTO;
    NotaEnfermera?: NotaEnfermeraDTO;
    BalanceHidrico?: BalanceHidricoDTO;
    HistorialObstetrico?: HistorialObstetricoDTO[];
    ControlPreNatal?: ControlPreNatalDTO[];
    SeguimientoAnalisis?: SeguimientoAnalisisDTO;
}