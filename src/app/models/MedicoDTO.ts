
export class MedicoDTO {
    Id!: number;
    NumeroDocumento!: string;
    ApellidoPaterno!: string;
    ApellidoMaterno!: string;
    Nombres!: string;
    Email?: string;
    Direccion?: string;
    Celular?: string;
    FechaNacimiento!: Date;
    ImagenPerfil?: string;
    ImagenFirma?: string;
    Estado!: boolean;
    NroColegiatura?: string;
    Rne?: string;
    IdSexo!: number;
    IdTipoDocumento!: number;
    IdDistrito?: number;
    IdProvincia?: number;
    IdDepartamento?: number;
    IdPais?: number;
    IdRol?: number;
    UsuarioCreacion!: string;
    UsuarioModificacion!: string;
    FechaCreacion!: Date;
    FechaModificacion!: Date;
}