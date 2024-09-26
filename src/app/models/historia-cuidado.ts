import { CabeceraPacienteDTO } from "./cabecera-paciente";
import { ControlEpocDTO } from "./control-epoc";
import { ControlGeneralDTO } from "./control-general";
import { ControlGlucosaDTO } from "./control-glucosa";
import { HistoriaExternaDTO } from "./historia-externa";
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
    ControlPresion?:string;
    ControlGeneral?:ControlGeneralDTO[];
    ControlGlucosa?:ControlGlucosaDTO[];
    ControlEpoc?:ControlEpocDTO[];
    Receta?:RecetaDTO[];
    HistoriaExterna!:HistoriaExternaDTO;
}