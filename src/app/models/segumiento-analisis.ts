import { DetalleSeguimientoDTO } from "./detalle-seguimiento";

export class SeguimientoAnalisisDTO
{
    FechaRegistro?:Date;
    Medico?:string;
    Detalle?:DetalleSeguimientoDTO[];
}