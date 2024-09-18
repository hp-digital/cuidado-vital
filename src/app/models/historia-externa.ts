import { AnamnesisDTO } from "./anamnesis";
import { AntecedentesAnamnesisDTO } from "./antecedente-anamnesis";
import { DiagnosticoCuidadoDTO } from "./diagnostico-cuidado";
import { ExamenFisicoDTO } from "./examen-fisico";
import { FuncionBiologicaDTO } from "./funcion-biologica";
import { MedicoAtiendeDTO } from "./medico-atiende";
import { PacienteExternoDTO } from "./paciente-externo";

export class HistoriaExternaDTO
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
    Anamnesis?:AnamnesisDTO;
    FuncionBiologica?:FuncionBiologicaDTO;
    ExamenFisico?:ExamenFisicoDTO;
    Diagnostico?:DiagnosticoCuidadoDTO[];
    PlanTrabajo!:string;
    UrlPdfHistoriaClinica?:string;
}