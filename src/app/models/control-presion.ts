import { MedidasAntropometricasDTO } from "./medidas-antropometricas";

export class ControlPresionDTO{
    Fecha!:Date;
    Paciente!:string;
    MedidasAntropometricas!:MedidasAntropometricasDTO[];
    PlanTrabajo!:string;
}