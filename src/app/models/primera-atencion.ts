import { DiagnosticoPrimeraAtencionDTO } from "./diagnostico-primera-atencion";

export class HistoriaPrimeraAtencionDTO{
    Paciente !: string;
    NroHcl !: string;
    FechaPrimeraAtencion !: Date;
    Anamnesis !: string;
    FuncionBiologica !: string;
    FuncionVital !: string;
    Diagnostico !: DiagnosticoPrimeraAtencionDTO[];
}