import { EvaluacionDTO } from "./evaluacion-nota";

export class SoapieDTO{
    Subjetivos?:string ;
    Objetivos?:string ;
    Medicacion?:EvaluacionDTO[] ;
    Procedimiento?:EvaluacionDTO[] ;
    Diagnostico?:EvaluacionDTO[] ;
    Planteamiento?:EvaluacionDTO[] ;
    Ocurrencias?:EvaluacionDTO[] ;
    Pendientes?:EvaluacionDTO[] ;
    Evaluacion?:EvaluacionDTO[] ;
    Diuresis?:EvaluacionDTO[] ;
    Deposicion?:EvaluacionDTO[] ;
}