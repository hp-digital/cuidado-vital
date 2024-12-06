import { DiagnosticoCuidadoDTO } from "./diagnostico-cuidado";
import { MedicoAtiendeDTO } from "./medico-atiende";
import { PacienteExternoDTO } from "./paciente-externo";

export class HistoriaExternaObstetriciaDTO
{
    CodigoIpress?:string;
    NumeroRuc?:string;
    RazonSocial?:string;
    NumeroHistoriaClinica?:string;
    FechaInicioAtencion!:Date;
    FechaCierreAtencion?:Date;
    Especialidad!:number;
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
    
    PlanTrabajo!:string;
    UrlPdfHistoriaClinica?:string;
}