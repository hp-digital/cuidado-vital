import { MedidasAntropometricasDTO } from "./medidas-antropometricas";

export class ControlPresionDTO{
    Fecha!:Date;
    Paciente!:string;
    MedidasAntroprometricas!:MedidasAntropometricasDTO[];
    PlanTrabajo!:string;
}