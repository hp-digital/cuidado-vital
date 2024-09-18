export class CabeceraPacienteDTO
{
    Nombre!:string;
    ApellidoPaterno!:string;
    ApellidoMaterno!:string;
    FechaAtencion!:Date;
    NumeroHistoriaClinica!:string;
    Edad!:number;
    Celular!:string;
    EstadoCivil?:string;
    Ocupacion?:string;
    NumeroDocumento!:string;
    Direccion?:string;
}