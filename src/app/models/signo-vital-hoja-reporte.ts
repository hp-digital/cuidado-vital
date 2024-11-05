import { DEtalleHojaReporteDTO } from "./detalle-hoja-reporte";

export class SignoVitalHojaReporteDTO
{
    FechaCabecera?:string;
    //DetalleHojaReporte!:DEtalleHojaReporteDTO[];
    FechaRegistro?:string;
    PresionSistolica!: number;
    PresionDiastolica!: number;
    Pulso!: number;
    Temperatura!: number;
    FrecuenciaRespiratoria!: number;
    Saturacion!: number;
    Oxigeno!: number;
    Peso!: number;
    Deposiciones!: number;
    Orina!: number;
    Ingresos!: number;
    Egresos!: number;
    TotalBH!: number;
}