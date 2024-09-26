import { ComboDTO } from "./ComboDTO";
import { ComboKatzDTO } from "./comboKatzDTO";

export class ControlEpocDTO
{
    Paciente !:string;
    Banio !: ComboKatzDTO;
    Vestido !:ComboKatzDTO;
    UsoWC !:ComboKatzDTO;
    Movilidad !:ComboKatzDTO;
    Continencia !:ComboKatzDTO;
    Alimentacion !:ComboKatzDTO;
    ResultadoKatz !:string;
    Dificultad !:string;
    FaseEpoc !:ComboDTO;
    FechaDiagnostico !:string;
    Alcohol? :string;
    Drogas? :string;
    Tabaco? :string;
    SintomasResp ?:string;
    SintomasRespDetalle ?:string;
    EvaluacionFuncional ?:string;
    PlanTrabajo ?:string;
}