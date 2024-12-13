import { AntecedentesObsDTO } from "./antecedentes-obs";
import { DiagnosticoCuidadoDTO } from "./diagnostico-cuidado";
import { ExamenPreferencialObsDTO } from "./examen-preferencial-obs";
import { MedicoAtiendeDTO } from "./medico-atiende";
import { PacienteExternoDTO } from "./paciente-externo";
import { SignoVitalObsDTO } from "./signo-vital-obs";

export class HistoriaExternaObstetriciaDTO
{
    CodigoIpress?:string;
    NumeroRuc?:string;
    RazonSocial?:string;
    NumeroHistoriaClinica?:string;
    FechaInicioAtencion!:Date;
    FechaCierreAtencion?:Date;
    Especialidad!:number;
    IdPacienteExterno?:number;
    Medico!:MedicoAtiendeDTO;
    Paciente!:PacienteExternoDTO;
    Antecedentes?:AntecedentesObsDTO;
    Quirurgico?:string[];
    Medicos?:string[];
    Patologicos?:string[];
    Fumar?:string;
    Alcohol?:string;
    Drogas?:string;
    SignoVital?:SignoVitalObsDTO;
    Diagnostico?:DiagnosticoCuidadoDTO[];
    Preferencial?:ExamenPreferencialObsDTO;
    PlanTrabajo?:string;
    UrlPdfHistoriaClinica?:string;
}