import { SignoVitalHojaDTO } from "./signo-vital-hoja";

export class HojaMonitoreoSignosDTO
{
    Paciente!:string;
    Medico!:string;
    SignoVital?:SignoVitalHojaDTO[];
}