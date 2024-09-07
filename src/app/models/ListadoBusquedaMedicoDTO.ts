export class ListadoBusquedaMedicoDTO
{
    id!: number;
    numeroDocumento!:string;
    medico!:string;
    celular!:string;
    fechaNacimiento!:Date;
    nroColegiatura?:string;
    rne?:string;
    fechaCreacion?:Date;
}