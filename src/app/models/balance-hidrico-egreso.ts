import { BalanceHidricoDetalleDTO } from "./balance-hidrico-detalle";

export class BalanceHidricoEgresoDTO {
    Orina?:BalanceHidricoDetalleDTO;
    Vomito?:BalanceHidricoDetalleDTO;
    Aspiracion?:BalanceHidricoDetalleDTO;
    Drenaje?:BalanceHidricoDetalleDTO[];
    PerdidaIncesante?:BalanceHidricoDetalleDTO;
    Deposiciones?:BalanceHidricoDetalleDTO;
    Otros?:BalanceHidricoDetalleDTO[];
    SumatoriaTotal?:string;
    Fecha!:Date;
    FechaTexto!:string;
}