import { DesplegableDTO } from "./depleglable";

export class SignosAlarmasDTO
{
    Item?:number;
    Medico?:string;
    FechaRegistroPaciente?:Date;
    ComentarioPaciente?:string;
    FechaRegistroMedico?:Date;
    ComentarioMedico?:string;
    Signos?:DesplegableDTO[];
}