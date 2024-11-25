export class ListadoBusquedaAtencionDTO{
    idHistoriaClinica!:number;
    idPaciente!:number;
    numeroDocumento!:string;
    paciente!:string;
    idMedico!:number;
    medico!:string;
    idHistoriaEstado!:number;
    estadoHistoria!:string;
    fechaInicioAtencion!:Date;
    idPacienteServicio!:number;
    idEspecialidad!:number;
    especialidadMedica!:string;
    motivoAtencion!:string;
    indicaciones!:string;
    idTipoOrigenAtencion!:number;
    numeroCelular !: string;
    idMonitoreo ?: number;
    fur ?: Date;
    egEco ?: number;
    fechaUltimoControl ?: Date;
}