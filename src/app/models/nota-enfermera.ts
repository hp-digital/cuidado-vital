import { SignoVitalNotaDTO } from "./signo-vital-notal";
import { SoapieDTO } from "./soapie";

export class NotaEnfermeraDTO {
    Paciente?:string;
    Medico?:string;
    NroHcl?:string;
    FechaNota?:Date;
    SignoVital?: SignoVitalNotaDTO;
    Soapie?: SoapieDTO;
}