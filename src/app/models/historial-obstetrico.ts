import { AntecedenteObstetricoDTO } from "./antecedente-obstetrico";
import { ExamenPreferencialDTO } from "./examen-preferencial";
import { FuncionVitalObstetriciaDTO } from "./funcion-vital-obstetricia";
import { RiesgoActualDTO } from "./riesgo-actual";
import { RiesgoObstetricoDTO } from "./riesgo-obstetrico";

export class HistorialObstetricoDTO
{
    Paciente?: string;
    NroHcl?: string;
    Personal?: string;
    IdPersonal?: number;
    FechaRegistro?:Date;
    Antecedentes?:AntecedenteObstetricoDTO;
    RiesgosPreExistente?: RiesgoObstetricoDTO;
    RiesgoActual?:RiesgoActualDTO;
    FuncionVital?:FuncionVitalObstetriciaDTO;
    ExamenPreferencial?:ExamenPreferencialDTO;
    Aro?: string;
    AroMotivo?: string;
    DatoNino?:string;
    SignosAlarma?: string;
    Diagnostico?: string;
    RecomendacionesGenerales?:string[];
    RecomendacionesEspecificas?:string[];
}