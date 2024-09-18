import { CabeceraPacienteDTO } from "./cabecera-paciente";
import { HistoriaExternaDTO } from "./historia-externa";

export class HistoriaCuidadoDTO{
    cabeceraPaciente?:CabeceraPacienteDTO;
    IdPaciente!: number;
    IdHistoriaClinica?: number;
    IdPersonal?: number;
    IdMedico!: number;
    FechaInicioAtencion!:Date;
    FechaFinAtencion?:Date;
    Estado!:boolean;
    UsuarioCreacion!:string;
    UsuarioModificacion!:string;
    FechaCreacion!:Date;
    FechaModificacion!:Date;
    ControlPresion?:string;
    ControlGeneral?:string;
    ControlGlucosa?:string;
    ControlEpoc?:string;
    HistoriaExterna!:HistoriaExternaDTO;
}