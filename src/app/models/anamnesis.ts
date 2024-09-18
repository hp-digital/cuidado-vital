import { AntecedentesAnamnesisDTO } from "./antecedente-anamnesis";

export class AnamnesisDTO
{
    TiempoEnfermedad?:string;
    MotivoConsulta?:string;
    SignosSintomas?:string;
    CursoEnfermedad?:string; 
    Antecedentes?: AntecedentesAnamnesisDTO;
}