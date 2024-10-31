
import { BalanceHidricoTurnoDTO } from "./balance-hidrico-turno";

export class BalanceHidricoDTO{  
    Paciente!: string;
    Medico!: string;
    NroHcl?:string;
    Peso!:number;
    Talla!:number;
    IMC!:number;
    Tiempo!:number;
    Fecha!:Date;
    FechaTexto!: string;
    BalanceHidrico?:BalanceHidricoTurnoDTO[];
}


