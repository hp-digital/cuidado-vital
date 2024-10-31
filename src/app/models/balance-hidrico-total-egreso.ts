import { PersonalResponsableDTO } from "./personal-responsable";

export class BalanceHidricoTotalEgresoDTO {
    PersonalResponsable!:PersonalResponsableDTO;
    Fecha!:Date;

    TotalOrina?:number;
    TotalVomito?:number;
    TotalSuccion?:number;
    TotalDrenaje?:number;
    TotalPerdidaIncesante?:number;
    TotalDeposiciones?:number;
    TotalOtroEgreso?:number;
    SumatoriaTotalEgresos?:number;
}