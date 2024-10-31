import { PersonalResponsableDTO } from "./personal-responsable";

export class BalanceHidricoTotalIngresoDTO {
    PersonalResponsable!:PersonalResponsableDTO;
    Fecha!:Date;
    TotalOral?:number;
    TotalParental?:number;
    TotalSangre?:number;
    TotalAguaOxidacion?:number;
    TotalOtros?:number;
    SumatoriaTotalIngresos?:number;
}