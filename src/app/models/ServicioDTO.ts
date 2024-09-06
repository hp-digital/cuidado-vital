export class ServicioDTO{
     idPaciente !:number;
     motivoAtencion !:string;
     precio?:number;
     idEspecialidad!:number;
     idMedico!:number;
     fechaInicioAtencion !:Date;
     fechaFinAtencion? :Date;
     idEstadoPacienteServicio !:number;
     indicaciones? :string;
    idModalidadPago ?:number;
     idEstadoPago ?:number;
    idTipoAtencion ?:number;
     estado !:boolean;
     usuarioCreacion!:string;
     usuarioModificacion! :string;
     fechaCreacion!:Date;
     fechaModificacion! :Date;
}