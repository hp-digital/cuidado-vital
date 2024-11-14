export class HistorialObstetricoDTO
{
    Paciente?: string;
    NroHcl?: string;
    Personal?: string;
    IdPersonal?: number;
    FechaRegistro?:Date;
    


    SignosAlarma?: string;
    RecomendacionesGenerales?:string[];
    RecomendacionesEspecificas?:string[];
}