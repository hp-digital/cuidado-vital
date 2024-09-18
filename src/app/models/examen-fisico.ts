import { ExamenRegionalDTO } from "./examen-regional";
import { SignoVitalDTO } from "./signo-vital";

export class ExamenFisicoDTO
{
    ExamenGeneral?:string;
    FuncionVital!:SignoVitalDTO;
    ExamenRegional!:ExamenRegionalDTO;
}