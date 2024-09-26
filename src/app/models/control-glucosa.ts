import { DesplegableDTO } from "./depleglable";

export class ControlGlucosaDTO
{
    Paciente !:string;
    TipoDiabetes !:string;
    FechaDiagnostico !:Date;
    Complicacion !: DesplegableDTO;
    Retinopatia !:DesplegableDTO;
    Nefropatia !:DesplegableDTO;
    Amputacion !:DesplegableDTO;
    Dialisis !:DesplegableDTO;
    Ceguera !:DesplegableDTO;
    TransplanteRenal !:DesplegableDTO;
    Talla !:number;
    Peso !:number;
    IMC !:number;
    PerimetroAbdominal !:number;
    PresionArterial !:number;
    ValorGlucemia !:string;
    FechaGlucemia !:Date;
    ValorHba !:string;
    FechaHba !:Date;
    ValorCreatinina !:string;
    FechaCreatinina !:Date;
    ValorLdl !:string;
    FechaLdl !:Date;
    ValorTrigliceridos !:string;
    FechaTrigliceridos !:Date;
    ValorMicro !:string;
    FechaMicro !:Date;
    PlanTrabajo !:string;
    InsulinaMono !:string;
    InsulinaDosis !:string;
    MedicamentoMono !:string;
    MedicamentoDosis !:string;
    FechaRegistro !: Date;
}