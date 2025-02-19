export class RegistroNuevaAtencionPacienteDTO{
    idPaciente!:number;
    numeroDocumento!:string;
    tipoDocumento!:number; 
    apellidoPaterno!:string;
    apellidoMaterno!:string;
    nombres!:string;
    fechaNacimiento!:Date;
    sexo!:number;
    celular!:string;
    idMedico!:number;
    fechaInicioAtencion!:Date;
    idEspecialidad!:number;
    estado!:boolean;
    usuarioCreacion!:string;
    usuarioModificacion!:string;
    fechaCreacion!:Date;
    fechaModificacion!:Date;
}