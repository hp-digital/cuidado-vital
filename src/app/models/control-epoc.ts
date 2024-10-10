import { DesplegableDTO } from "./depleglable";

export class ControlEpocDTO{
    Paciente !: string;
    FechaRegistro!: Date;
    Banno!: DesplegableDTO;
    Vestido!: DesplegableDTO;
    Wc!: DesplegableDTO;
    Movilidad!: DesplegableDTO;
    Continencia!: DesplegableDTO;
    Alimentacion!: DesplegableDTO;
    ResultadoEscala!: DesplegableDTO;
    Dificultad!: string;
    FaseEpoc!: DesplegableDTO;
    FechaDiagnostico!: Date;
    Alcohol!: DesplegableDTO;
    Drogas!: DesplegableDTO;
    Tabaco!: DesplegableDTO;
    SistemaRespiratorio!: DesplegableDTO;
    SistemaRespiratorioDetalle!: string;
    EvaluacionFuncional!: string;
    PlanTrabajo!: string;
}