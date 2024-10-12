import { CabeceraPacienteDTO } from "./cabecera-paciente";
import { ControlEpocDTO } from "./control-epoc";
import { ControlGeneralDTO } from "./control-general";
import { ControlGlucosaDTO } from "./control-glucosa";
import { ControlPresionDTO } from "./control-presion";
import { HistoriaExternaDTO } from "./historia-externa";
import { MedicoAtencionDTO } from "./medico-atiente";
import { OrdenDTO } from "./OrdenDTO";
import { RecetaDTO } from "./RecetaDTO";

export class HistoriaCuidadoDTO{
    cabeceraPaciente?:CabeceraPacienteDTO;
    MedicoAtiende?:MedicoAtencionDTO;
    IdPaciente!: number;
    IdHistoriaClinica?: number;
    IdPersonal?: number;
    IdMedico!: number;
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
}