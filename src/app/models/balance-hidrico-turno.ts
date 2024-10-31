import { BalanceHidricoEgresoDTO } from "./balance-hidrico-egreso";
import { BalanceHidricoIngresoDTO } from "./balance-hidrico-ingresos";

export class BalanceHidricoTurnoDTO{
    Item!:number; 
    Fecha!:Date;
    FechaTexto!:string; 
    DatosCompletos!:boolean;  
    Ingreso?:BalanceHidricoIngresoDTO;
    Egreso?:BalanceHidricoEgresoDTO;
    BalanceHidrico?:number;
}