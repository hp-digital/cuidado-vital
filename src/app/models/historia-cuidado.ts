import { CabeceraPacienteDTO } from "./cabecera-paciente";
import { ControlGeneralDTO } from "./control-general";
import { ControlGlucosaDTO } from "./control-glucosa";
import { ControlPresionDTO } from "./control-presion";
import { HistoriaExternaDTO } from "./historia-externa";
import { OrdenDTO } from "./OrdenDTO";
import { RecetaDTO } from "./RecetaDTO";

export class HistoriaCuidadoDTO{
    cabeceraPaciente?:CabeceraPacienteDTO;
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
    ControlEpoc?:string;
    Receta?:RecetaDTO[];
    Orden?:OrdenDTO[];
    HistoriaExterna!:HistoriaExternaDTO;
}