import { BalanceHidricoDetalleDTO } from "./balance-hidrico-detalle";

export class BalanceHidricoIngresoDTO {
    Oral?:BalanceHidricoDetalleDTO;
    Parental?:BalanceHidricoDetalleDTO;
    ParentalTratamiento?:BalanceHidricoDetalleDTO;
    Sangre?:BalanceHidricoDetalleDTO;
    AguaOxidacion?:BalanceHidricoDetalleDTO;
    Otros?:BalanceHidricoDetalleDTO[];
    SumatoriaTotal?:string;
    Fecha!:Date;
    FechaTexto!:string;
}