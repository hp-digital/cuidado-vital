export class ListadoBusquedaServicioDTO
{
     id!: number; 
     idPaciente!: number; 
     paciente!: string;
     motivoAtencion!: string; 
     idEspecialidad!: number; 
     especialidad!:string;
     idMedico!: number; 
     medico!: string; 
     fechaInicioAtencion!: Date; 
     idEstadoPacienteServicio!: number; 
     estadoServicio!: string; 
     idEstadoPago!: number; 
     estadoPago!: string;
     idTipoAtencion!: number; 
     tipoAtencion!: string; 
     fechaCreacion!: Date; 
}